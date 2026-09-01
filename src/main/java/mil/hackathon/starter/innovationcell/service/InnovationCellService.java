package mil.hackathon.starter.innovationcell.service;

import lombok.AllArgsConstructor;
import mil.hackathon.starter.innovationcell.db.InnovationCell;
import mil.hackathon.starter.innovationcell.db.InnovationCellRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class InnovationCellService {
    InnovationCellRepository innovationCellRepository;

    public List<InnovationCell> getInnovationCells() {
        return innovationCellRepository.findAll();
    }

    public void addInnovationCell(InnovationCell innovationCell) {
        innovationCellRepository.save(innovationCell);
    }
}
