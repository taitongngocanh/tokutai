package com.habitquest.service;

import com.habitquest.dto.GoodHabitDto;
import com.habitquest.entity.GoodHabit;
import com.habitquest.entity.User;
import com.habitquest.repository.GoodHabitRepository;
import com.habitquest.util.RankUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.habitquest.entity.GoodHabitCompletion;
import com.habitquest.repository.GoodHabitCompletionRepository;

@Service
@RequiredArgsConstructor
public class GoodHabitService {

    private final GoodHabitRepository goodHabitRepository;
    private final GoodHabitCompletionRepository completionRepository;
    private final UserService userService;
    private final XPService xpService;

    public List<GoodHabitDto> getHabitsByUser(String username) {
        User user = userService.getUserByUsername(username);
        return goodHabitRepository.findByUserId(user.getId()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public GoodHabitDto createHabit(String username, GoodHabitDto dto) {
        User user = userService.getUserByUsername(username);
        GoodHabit habit = GoodHabit.builder()
                .user(user)
                .name(dto.getName())
                .xpReward(dto.getXpReward() > 0 ? dto.getXpReward() : 50)
                .build();
        habit = goodHabitRepository.save(habit);
        return toDto(habit);
    }

    public GoodHabitDto updateHabit(String username, Long id, GoodHabitDto dto) {
        GoodHabit habit = getHabitForUser(username, id);
        habit.setName(dto.getName());
        if (dto.getXpReward() > 0) habit.setXpReward(dto.getXpReward());
        habit = goodHabitRepository.save(habit);
        return toDto(habit);
    }

    public void deleteHabit(String username, Long id) {
        GoodHabit habit = getHabitForUser(username, id);
        goodHabitRepository.delete(habit);
    }

    @Transactional
    public GoodHabitDto completeToday(String username, Long id) {
        return toggleCompleteForDate(username, id, LocalDate.now());
    }

    @Transactional
    public GoodHabitDto toggleCompleteForDate(String username, Long id, LocalDate date) {
        GoodHabit habit = getHabitForUser(username, id);
        User user = habit.getUser();

        Optional<GoodHabitCompletion> completion = completionRepository.findByGoodHabitIdAndDate(id, date);
        
        if (completion.isPresent()) {
            // Uncomplete
            completionRepository.delete(completion.get());
            xpService.subtractXP(user.getId(), habit.getXpReward(), "Undo good habit: " + habit.getName());
            
            // Re-evaluate lastCompletedDate if it was today
            if (date.equals(LocalDate.now())) {
                habit.setLastCompletedDate(null); // Simple fallback, or query for max date
                goodHabitRepository.save(habit);
            }
        } else {
            // Complete
            GoodHabitCompletion newCompletion = GoodHabitCompletion.builder()
                .goodHabit(habit)
                .date(date)
                .build();
            completionRepository.save(newCompletion);
            xpService.addXP(user.getId(), habit.getXpReward(), "Good habit: " + habit.getName());
            
            if (date.equals(LocalDate.now()) || (habit.getLastCompletedDate() == null || date.isAfter(habit.getLastCompletedDate()))) {
                habit.setLastCompletedDate(date);
                goodHabitRepository.save(habit);
            }
        }
        
        return toDto(habit);
    }
    
    public List<LocalDate> getCompletions(String username, Long id, LocalDate startDate, LocalDate endDate) {
        GoodHabit habit = getHabitForUser(username, id);
        return completionRepository.findByGoodHabitUserIdAndDateBetween(habit.getUser().getId(), startDate, endDate)
                .stream()
                .filter(c -> c.getGoodHabit().getId().equals(id))
                .map(GoodHabitCompletion::getDate)
                .collect(Collectors.toList());
    }
    
    public List<GoodHabitCompletion> getAllCompletionsForUser(String username, LocalDate startDate, LocalDate endDate) {
        User user = userService.getUserByUsername(username);
        return completionRepository.findByGoodHabitUserIdAndDateBetween(user.getId(), startDate, endDate);
    }

    private GoodHabit getHabitForUser(String username, Long id) {
        User user = userService.getUserByUsername(username);
        GoodHabit habit = goodHabitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));
        if (!habit.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Habit not found");
        }
        return habit;
    }

    private GoodHabitDto toDto(GoodHabit habit) {
        GoodHabitDto dto = new GoodHabitDto();
        dto.setId(habit.getId());
        dto.setName(habit.getName());
        dto.setXpReward(habit.getXpReward());
        dto.setLastCompletedDate(habit.getLastCompletedDate());
        dto.setCompletedToday(habit.isCompletedToday());
        return dto;
    }
}
