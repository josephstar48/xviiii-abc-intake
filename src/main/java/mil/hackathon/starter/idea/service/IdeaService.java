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
        } else {
            innovationCellRepository.findAll().stream()
                    .filter(cell -> shouldRouteToCell(idea, cell))
                    .findFirst()
                    .ifPresent(cell -> {
                        idea.setInnovationCell(cell);
                        idea.setStage(Stage.ASSIGNED);
                        idea.setRoutingNotes("Auto-routed by unit and capability lane.");
                    });
        }

        if (idea.getStage() == null) {
            idea.setStage(Stage.SUBMITTED);
        }
        ideaRepository.save(idea);
    }

    private boolean shouldRouteToCell(Idea idea, InnovationCell cell) {
        String unitDivision = normalize(idea.getUnitDivision());
        String lane = normalize(idea.getCapabilityLane());
        String cellName = normalize(cell.getName());

        if (unitDivision.contains("XVIII") && (lane.contains("SOFTWARE") || lane.contains("DATA") || lane.contains("AI"))) {
            return cellName.contains("JIOP") || cellName.contains("ODS");
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

    private String normalize(String value) {
        return value == null ? "" : value.toUpperCase();
    }

    public void updateInnovationCell(Long id, Long innovationCellId) {
        Optional<Idea> maybeIdea = ideaRepository.findById(id);
        if (maybeIdea.isPresent()) {
            Idea idea = maybeIdea.get();
            if (innovationCellId == null) {
                idea.setInnovationCell(null);
                log.info("Unassigning idea {} from innovation cell", id);
            } else {
                Optional<InnovationCell> maybeInnovationCell = innovationCellRepository.findById(innovationCellId);
                if (maybeInnovationCell.isPresent()) {
                    InnovationCell innovationCell = maybeInnovationCell.get();
                    idea.setInnovationCell(innovationCell);
                    idea.setStage(Stage.ASSIGNED);
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
