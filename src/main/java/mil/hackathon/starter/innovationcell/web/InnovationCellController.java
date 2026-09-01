package mil.hackathon.starter.innovationcell.web;

import lombok.AllArgsConstructor;
import mil.hackathon.starter.innovationcell.db.InnovationCell;
import mil.hackathon.starter.innovationcell.service.InnovationCellService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/innovation-cells")
@AllArgsConstructor
public class InnovationCellController {
    InnovationCellService innovationCellService;

    @GetMapping
    public ResponseEntity<List<InnovationCell>> getInnovationCells() {
        return ResponseEntity.ok(innovationCellService.getInnovationCells());
    }

    @PostMapping
    public ResponseEntity<Void> addInnovationCell(@RequestBody InnovationCell innovationCell) {
        innovationCellService.addInnovationCell(innovationCell);
        return ResponseEntity.ok().build();
    }
}
