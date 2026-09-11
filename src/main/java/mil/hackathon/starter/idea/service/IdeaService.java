package mil.hackathon.starter.idea.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mil.hackathon.starter.idea.db.Idea;
import mil.hackathon.starter.idea.db.IdeaRepository;
import mil.hackathon.starter.idea.db.Stage;
import mil.hackathon.starter.innovationcell.db.InnovationCell;
import mil.hackathon.starter.innovationcell.db.InnovationCellRepository;
import mil.hackathon.starter.tag.db.Tag;
import mil.hackathon.starter.tag.db.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class IdeaService {
    IdeaRepository ideaRepository;
    InnovationCellRepository innovationCellRepository;
    TagRepository tagRepository;

    public List<Idea> getIdeas() {
        return ideaRepository.findAllByOrderByIdAsc();
    }

    public void addIdea(Idea idea) {
        if (idea.getTags() != null && !idea.getTags().isEmpty()) {
            Set<Tag> tags = idea.getTags().stream()
                    .map(tag -> tagRepository.findById(tag.getId())
                            .orElseThrow(() -> new RuntimeException("Tag not found")))
                    .collect(Collectors.toSet());
            idea.setTags(tags);
        }

        if (idea.getInnovationCell() != null && idea.getInnovationCell().getId() != null) {
            InnovationCell innovationCell = innovationCellRepository.findById(idea.getInnovationCell().getId())
                    .orElseThrow(() -> new RuntimeException("Innovation cell not found"));
            idea.setInnovationCell(innovationCell);
            idea.setStage(Stage.ASSIGNED);
            idea.setRoutingNotes("Manually selected by submitter.");
        } else {
            Optional<InnovationCell> routedCell = findBestRoutingCell(idea, innovationCellRepository.findAll());

            if (routedCell.isPresent()) {
                idea.setInnovationCell(routedCell.get());
                idea.setStage(Stage.ASSIGNED);
                idea.setRoutingNotes(buildAutoRoutingNote(idea, routedCell.get()));
            } else {
                idea.setRoutingNotes("No confident automatic match. Corps admin should manually triage and assign.");
            }
        }

        if (idea.getStage() == null) {
            idea.setStage(Stage.SUBMITTED);
        }
        ideaRepository.save(idea);
    }

    private Optional<InnovationCell> findBestRoutingCell(Idea idea, List<InnovationCell> cells) {
        Optional<InnovationCell> odsMatch = cells.stream()
                .filter(cell -> shouldRouteToOds(idea, cell))
                .findFirst();

        if (odsMatch.isPresent()) {
            return odsMatch;
        }

        Optional<InnovationCell> unitMatch = cells.stream()
                .filter(cell -> shouldRouteByUnit(idea, cell))
                .findFirst();

        if (unitMatch.isPresent()) {
            return unitMatch;
        }

        return cells.stream()
                .filter(cell -> shouldRouteToCorpsCell(idea, cell))
                .findFirst();
    }

    private boolean shouldRouteByUnit(Idea idea, InnovationCell cell) {
        String unitDivision = normalize(idea.getUnitDivision());
        String cellName = normalize(cell.getName());

        if (unitDivision.contains("XVIII")) {
            return isCorpsIntakeCell(cell);
        }
        if (unitDivision.contains("82ND")) {
            return cellName.contains("82ND");
        }
        if (unitDivision.contains("101ST")) {
            return cellName.contains("101ST");
        }
        if (unitDivision.contains("10TH")) {
            return cellName.contains("10TH");
        }
        if (unitDivision.contains("3RD")) {
            return cellName.contains("3RD");
        }
        return false;
    }

    private boolean shouldRouteToOds(Idea idea, InnovationCell cell) {
        return isOdsCell(cell) && isCorpsLevelSubmission(idea) && isDigitalCapability(idea);
    }

    private boolean shouldRouteToCorpsCell(Idea idea, InnovationCell cell) {
        String problemType = normalize(idea.getProblemType());

        return isCorpsIntakeCell(cell)
                && (problemType.contains("COMMAND AND CONTROL")
                || problemType.contains("C2"));
    }

    private boolean isDigitalCapability(Idea idea) {
        String lane = normalize(idea.getCapabilityLane());

        return lane.contains("SOFTWARE")
                || lane.contains("APPLICATION")
                || lane.contains("DATA")
                || lane.contains("DASHBOARD")
                || lane.contains("ANALYTICS")
                || lane.contains("AI")
                || lane.contains("AUTOMATION")
                || lane.contains("NETWORK")
                || lane.contains("COMMUNICATIONS");
    }

    private boolean isCorpsLevelSubmission(Idea idea) {
        return normalize(idea.getUnitDivision()).contains("XVIII");
    }

    private boolean isOdsCell(InnovationCell cell) {
        String cellName = normalize(cell.getName());
        return cellName.contains("ODS") || cellName.contains("OPERATIONAL DATA");
    }

    private boolean isCorpsIntakeCell(InnovationCell cell) {
        String cellName = normalize(cell.getName());
        return (cellName.contains("XVIII") || cellName.contains("JIOP")) && !isOdsCell(cell);
    }

    private String buildAutoRoutingNote(Idea idea, InnovationCell cell) {
        if (isOdsCell(cell)) {
            return "Auto-routed to ODS for Corps-level software, data, or digital capability support.";
        }

        if (shouldRouteByUnit(idea, cell)) {
            return "Auto-routed from submitted unit/division.";
        }

        return "Auto-routed to Corps JIOP based on submitted problem type.";
    }

    private String normalize(String value) {
        return value == null ? "" : value.toUpperCase();
    }

    public void updateInnovationCell(Long id, Long innovationCellId) {
        Optional<Idea> maybeIdea = ideaRepository.findById(id);
        if (maybeIdea.isPresent()) {
            Idea idea = maybeIdea.get();
            if (innovationCellId == null) {
                idea.setInnovationCell(null);
                idea.setStage(Stage.SUBMITTED);
                idea.setRoutingNotes("Manual routing cleared. Awaiting Corps admin triage.");
                log.info("Unassigning idea {} from innovation cell", id);
            } else {
                Optional<InnovationCell> maybeInnovationCell = innovationCellRepository.findById(innovationCellId);
                if (maybeInnovationCell.isPresent()) {
                    InnovationCell innovationCell = maybeInnovationCell.get();
                    idea.setInnovationCell(innovationCell);
                    idea.setStage(Stage.ASSIGNED);
                    idea.setRoutingNotes("Manually routed by Corps admin.");
                    log.info("Assigning idea {} to innovation cell {}", id, innovationCellId);
                } else {
                    log.warn("Innovation cell {} not found", innovationCellId);
                    return;
                }
            }
            ideaRepository.save(idea);
        } else {
            log.warn("Idea {} not found", id);
        }
    }
}
