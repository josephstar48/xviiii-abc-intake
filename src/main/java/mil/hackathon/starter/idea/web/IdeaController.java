package mil.hackathon.starter.idea.web;

import lombok.AllArgsConstructor;
import mil.hackathon.starter.idea.db.Idea;
import mil.hackathon.starter.idea.service.IdeaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ideas")
@AllArgsConstructor
public class IdeaController {
    IdeaService ideaService;

    @GetMapping
    public ResponseEntity<List<Idea>> getIdeas() {
        return ResponseEntity.ok(ideaService.getIdeas());
    }

    @PostMapping
    public ResponseEntity<Idea> addIdea(@RequestBody Idea idea) {
        return ResponseEntity.ok(ideaService.addIdea(idea));
    }

    @PostMapping("/update-innovation-cell/{ideaId}")
    public ResponseEntity<Idea> updateInnovationCell(@PathVariable Long ideaId, @RequestBody(required = false) Long innovationCellId) {
        return ideaService.updateInnovationCell(ideaId, innovationCellId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
