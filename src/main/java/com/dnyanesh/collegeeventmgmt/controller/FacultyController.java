package com.dnyanesh.collegeeventmgmt.controller;

import com.dnyanesh.collegeeventmgmt.dto.EventDto;
import com.dnyanesh.collegeeventmgmt.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
public class FacultyController {
    
    private final EventService eventService;
    
    @GetMapping("/hello")
    public String facultyHello() {
        return "Hello, Faculty!";
    }
    
    @PostMapping("/events")
    public ResponseEntity<EventDto> createEvent(@RequestBody EventDto dto) {
        // Faculty-created events start as unapproved and need admin approval
        EventDto createdEvent = eventService.createEvent(dto);
        return ResponseEntity.ok(createdEvent);
    }
    
    @GetMapping("/events")
    public ResponseEntity<java.util.List<EventDto>> getFacultyEvents() {
        // Faculty can see all events for approval purposes
        return ResponseEntity.ok(eventService.getAllEvents());
    }
}