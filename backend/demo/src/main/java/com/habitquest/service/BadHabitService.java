package com.habitquest.service;

import com.habitquest.dto.BadHabitDto;
import com.habitquest.entity.BadHabit;
import com.habitquest.entity.BadHabitViolation;
import com.habitquest.repository.BadHabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BadHabitService {

    private final BadHabitRepository badHabitRepository;
    private final UserService userService;
    private final XPService xpService;

    public List<BadHabitDto> getHabitsByUser(String username) {
        var user = userService.getUserByUsername(username);
        return badHabitRepository.findByUserId(user.getId()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public BadHabitDto createHabit(String username, BadHabitDto dto) {
        var user = userService.getUserByUsername(username);
        BadHabit habit = BadHabit.builder()
                .user(user)
                .name(dto.getName())
                .xpPenalty(dto.getXpPenalty() > 0 ? dto.getXpPenalty() : 30)
                .build();
        habit = badHabitRepository.save(habit);
        return toDto(habit);
    }

    public BadHabitDto updateHabit(String username, Long id, BadHabitDto dto) {
        BadHabit habit = getHabitForUser(username, id);
        habit.setName(dto.getName());
        if (dto.getXpPenalty() > 0) habit.setXpPenalty(dto.getXpPenalty());
        habit = badHabitRepository.save(habit);
        return toDto(habit);
    }

    public void deleteHabit(String username, Long id) {
        BadHabit habit = getHabitForUser(username, id);
        badHabitRepository.delete(habit);
    }

    @Transactional
    public BadHabitDto recordViolation(String username, Long id) {
        BadHabit habit = getHabitForUser(username, id);
        var user = habit.getUser();
        xpService.subtractXP(user.getId(), habit.getXpPenalty(), "Bad habit: " + habit.getName());
        BadHabitViolation violation = BadHabitViolation.builder().badHabit(habit).build();
        habit.getViolations().add(violation);
        badHabitRepository.save(habit);
        return toDto(habit);
    }

    private BadHabit getHabitForUser(String username, Long id) {
        var user = userService.getUserByUsername(username);
        BadHabit habit = badHabitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));
        if (!habit.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Habit not found");
        }
        return habit;
    }

    private BadHabitDto toDto(BadHabit habit) {
        BadHabitDto dto = new BadHabitDto();
        dto.setId(habit.getId());
        dto.setName(habit.getName());
        dto.setXpPenalty(habit.getXpPenalty());
        return dto;
    }
}
