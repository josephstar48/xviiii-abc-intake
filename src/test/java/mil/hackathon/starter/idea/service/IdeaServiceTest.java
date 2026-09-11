package mil.hackathon.starter.idea.service;

import mil.hackathon.starter.idea.db.Idea;
import mil.hackathon.starter.idea.db.IdeaRepository;
import mil.hackathon.starter.idea.db.Stage;
import mil.hackathon.starter.innovationcell.db.InnovationCell;
import mil.hackathon.starter.innovationcell.db.InnovationCellRepository;
import mil.hackathon.starter.tag.db.TagRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IdeaServiceTest {
    @Mock
    IdeaRepository ideaRepository;

    @Mock
    InnovationCellRepository innovationCellRepository;

    @Mock
    TagRepository tagRepository;

    @Test
    void routesCorpsDigitalSubmissionToOds() {
        IdeaService service = new IdeaService(ideaRepository, innovationCellRepository, tagRepository);
        Idea idea = Idea.builder()
                .unitDivision("XVIII ABC / Corps Headquarters")
                .capabilityLane("Data / dashboard / analytics")
                .problemType("Command and Control (C2)")
                .build();
        InnovationCell jiop = cell(1L, "XVIII ABC / JIOP");
        InnovationCell ods = cell(11L, "XVIII ABC / ODS");

        when(innovationCellRepository.findAll()).thenReturn(List.of(jiop, ods));
        when(ideaRepository.save(any(Idea.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Idea savedIdea = service.addIdea(idea);

        assertThat(savedIdea.getInnovationCell()).isEqualTo(ods);
        assertThat(savedIdea.getStage()).isEqualTo(Stage.ASSIGNED);
        assertThat(savedIdea.getRoutingNotes()).contains("ODS");
        assertThat(savedIdea.getLastUpdated()).isNotNull();
    }

    @Test
    void routesDivisionSubmissionToDivisionCellBeforeDigitalLane() {
        IdeaService service = new IdeaService(ideaRepository, innovationCellRepository, tagRepository);
        Idea idea = Idea.builder()
                .unitDivision("82nd Airborne Division")
                .capabilityLane("Software / application")
                .problemType("Movement and Maneuver")
                .build();
        InnovationCell ods = cell(11L, "XVIII ABC / ODS");
        InnovationCell airborneInnovationLab = cell(2L, "82nd Airborne Division / Airborne Innovation Lab");

        when(innovationCellRepository.findAll()).thenReturn(List.of(ods, airborneInnovationLab));
        when(ideaRepository.save(any(Idea.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Idea savedIdea = service.addIdea(idea);

        assertThat(savedIdea.getInnovationCell()).isEqualTo(airborneInnovationLab);
        assertThat(savedIdea.getStage()).isEqualTo(Stage.ASSIGNED);
        assertThat(savedIdea.getRoutingNotes()).isEqualTo("Auto-routed from submitted unit/division.");
    }

    @Test
    void respectsSubmitterSelectedInnovationCell() {
        IdeaService service = new IdeaService(ideaRepository, innovationCellRepository, tagRepository);
        InnovationCell selectedCellReference = cell(3L, null);
        InnovationCell eagleWerx = cell(3L, "101st Airborne Division / EagleWerx");
        Idea idea = Idea.builder()
                .innovationCell(selectedCellReference)
                .build();

        when(innovationCellRepository.findById(3L)).thenReturn(Optional.of(eagleWerx));
        when(ideaRepository.save(any(Idea.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Idea savedIdea = service.addIdea(idea);

        assertThat(savedIdea.getInnovationCell()).isEqualTo(eagleWerx);
        assertThat(savedIdea.getStage()).isEqualTo(Stage.ASSIGNED);
        assertThat(savedIdea.getRoutingNotes()).isEqualTo("Manually selected by submitter.");
    }

    @Test
    void manuallyRoutesIdeaFromAdmin() {
        IdeaService service = new IdeaService(ideaRepository, innovationCellRepository, tagRepository);
        Idea idea = Idea.builder()
                .id(7L)
                .stage(Stage.SUBMITTED)
                .build();
        InnovationCell targetCell = cell(4L, "10th Mountain Division / MISIL");

        when(ideaRepository.findById(7L)).thenReturn(Optional.of(idea));
        when(innovationCellRepository.findById(4L)).thenReturn(Optional.of(targetCell));
        when(ideaRepository.save(any(Idea.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<Idea> savedIdea = service.updateInnovationCell(7L, 4L);

        assertThat(savedIdea).isPresent();
        assertThat(savedIdea.get().getInnovationCell()).isEqualTo(targetCell);
        assertThat(savedIdea.get().getStage()).isEqualTo(Stage.ASSIGNED);
        assertThat(savedIdea.get().getRoutingNotes()).isEqualTo("Manually routed by Corps admin.");
        assertThat(savedIdea.get().getLastUpdated()).isNotNull();
    }

    private InnovationCell cell(Long id, String name) {
        return InnovationCell.builder()
                .id(id)
                .name(name)
                .build();
    }
}
