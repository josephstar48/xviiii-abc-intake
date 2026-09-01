package mil.hackathon.starter.innovationcell.db;

import jakarta.persistence.*;
import lombok.*;
import mil.hackathon.starter.tag.db.Tag;

import java.util.Set;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InnovationCell {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String name;
    String title;
    String description;
    String email;
    String phone;
    String address;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "innovation_cell_tags",
            joinColumns = @JoinColumn(name = "innovation_cell_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    Set<Tag> tags;
}

