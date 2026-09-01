package mil.hackathon.starter.tag.db;

import org.springframework.data.repository.CrudRepository;

import java.util.Set;

public interface TagRepository extends CrudRepository<Tag, Long> {
    Set<Tag> findAll();
}
