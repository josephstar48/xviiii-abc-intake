package mil.hackathon.starter.tag.web;

import lombok.AllArgsConstructor;
import mil.hackathon.starter.tag.db.Tag;
import mil.hackathon.starter.tag.service.TagService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/tags")
@AllArgsConstructor
public class TagController {
    TagService tagService;

    @GetMapping
    public ResponseEntity<Set<Tag>> getTags() {
        return ResponseEntity.ok(tagService.getTags());
    }

    @PostMapping
    public ResponseEntity<Void> addTag(@RequestBody Tag tag) {
        tagService.addTag(tag);
        return ResponseEntity.ok().build();
    }
}
