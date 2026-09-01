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
    public ResponseEntity<Void> addIdea(@RequestBody Idea idea) {
        ideaService.addIdea(idea);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/update-innovation-cell/{ideaId}")
    public ResponseEntity<Void> updateInnovationCell(@PathVariable Long ideaId, @RequestBody(required = false) Long innovationCellId) {
        ideaService.updateInnovationCell(ideaId, innovationCellId);
        return ResponseEntity.ok().build();
    }
}