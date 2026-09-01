package mil.hackathon.starter.idea.db;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface IdeaRepository extends CrudRepository<Idea, Long> {
    List<Idea> findAllByOrderByIdAsc();
}
