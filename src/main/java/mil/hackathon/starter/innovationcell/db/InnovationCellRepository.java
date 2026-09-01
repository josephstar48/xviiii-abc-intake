package mil.hackathon.starter.innovationcell.db;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface InnovationCellRepository extends CrudRepository<InnovationCell, Long> {
    List<InnovationCell> findAll();
}
