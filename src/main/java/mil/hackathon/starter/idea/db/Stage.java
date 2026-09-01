package mil.hackathon.starter.idea.db;

import lombok.Getter;

@Getter
public enum Stage {
    SUBMITTED(0),
    SCOPED(1),
    ASSIGNED(2),
    IN_PROTOTYPE(3),
    TESTING(4),
    DELIVERED(5);

    private final int value;

    Stage(int value) {
        this.value = value;
    }

}
