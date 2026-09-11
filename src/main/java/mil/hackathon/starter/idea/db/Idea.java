package mil.hackathon.starter.idea.db;

import jakarta.persistence.*;
import lombok.*;
import mil.hackathon.starter.document.db.Document;
import mil.hackathon.starter.innovationcell.db.InnovationCell;
import mil.hackathon.starter.submitter.db.Submitter;
import mil.hackathon.starter.tag.db.Tag;
import org.hibernate.annotations.Cascade;

import java.util.List;
import java.util.Set;
import java.time.OffsetDateTime;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Idea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String title;
    String problemStatement;
    String problemContext;
    String solutionBenefits;
    String solutionConcepts;
    String unitDivision;
    String problemType;
    String operationalImpact;
    String urgency;
    String capabilityLane;
    String routingNotes;
    OffsetDateTime lastUpdated;

    @OneToOne
    @JoinColumn(name = "submitter_id")
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    Submitter submitter;

    @OneToOne
    @JoinColumn(name = "innovation_cell_id")
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    InnovationCell innovationCell;

    @Enumerated(EnumType.ORDINAL)
    Stage stage;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "idea_tags",
            joinColumns = @JoinColumn(name = "idea_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    Set<Tag> tags;

    @OneToMany
    @JoinTable(
            name = "idea_documents",
            joinColumns = @JoinColumn(name = "idea_id"),
            inverseJoinColumns = @JoinColumn(name = "document_id")
    )
    List<Document> documents;
}
