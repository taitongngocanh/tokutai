package com.habitquest.controller;

import com.habitquest.dto.XPLogDto;
import com.habitquest.service.XPService;
import com.habitquest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/xp")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class XPLogController {

    private final XPService xpService;
    private final UserService userService;

    @GetMapping("/history")
    public ResponseEntity<List<XPLogDto>> getXPHistory(@AuthenticationPrincipal UserDetails user,
                                                       @RequestParam(defaultValue = "50") int limit) {
        var appUser = userService.getUserByUsername(user.getUsername());
        return ResponseEntity.ok(xpService.getXPHistory(appUser.getId(), limit));
    }
}
