package mil.hackathon.starter.tag.service;

import lombok.AllArgsConstructor;
import mil.hackathon.starter.tag.db.Tag;
import mil.hackathon.starter.tag.db.TagRepository;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@AllArgsConstructor
public class TagService {
    TagRepository tagRepository;

    public Set<Tag> getTags() {
        return tagRepository.findAll();
    }

    public void addTag(Tag tag) {
        tagRepository.save(tag);
    }
}
