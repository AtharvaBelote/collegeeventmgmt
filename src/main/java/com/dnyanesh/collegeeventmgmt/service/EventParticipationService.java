package com.dnyanesh.collegeeventmgmt.service;

import com.dnyanesh.collegeeventmgmt.dto.EventDto;
import com.dnyanesh.collegeeventmgmt.dto.EventRegistrationDto;
import com.dnyanesh.collegeeventmgmt.model.Event;
import com.dnyanesh.collegeeventmgmt.model.EventRegistration;
import com.dnyanesh.collegeeventmgmt.model.User;
import com.dnyanesh.collegeeventmgmt.repository.EventRegistrationRepository;
import com.dnyanesh.collegeeventmgmt.repository.EventRepository;
import com.dnyanesh.collegeeventmgmt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventParticipationService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final UserRepository userRepository;
    private final EventService eventService;

    // List all events (optionally filter for upcoming/past)
    public List<EventDto> listEvents(String filter) {
        // Defensive: Never allow null to propagate, avoids NPE in frameworks using hashCode
        if (filter == null) filter = "";
        LocalDateTime now = LocalDateTime.now();
        List<Event> events = switch (filter) {
            case "upcoming" -> eventRepository.findAll().stream()
                    .filter(e -> e.getStartTime().isAfter(now))
                    .collect(Collectors.toList());
            case "past" -> eventRepository.findAll().stream()
                    .filter(e -> e.getEndTime().isBefore(now))
                    .collect(Collectors.toList());
            default -> eventRepository.findAll();
        };
        return events.stream().map(this::toDto).collect(Collectors.toList());
    }

    // Get event details
    public EventDto getEventDetails(Long eventId) {
        return eventRepository.findById(eventId)
                .map(this::toDto)
                .orElse(null);
    }

    // Register current user for event
    public EventRegistrationDto registerForEvent(Long eventId, String username) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Prevent duplicate registration
        if (eventRegistrationRepository.findByEventAndUser(event, user).isPresent()) {
            throw new RuntimeException("Already registered");
        }
        EventRegistration registration = EventRegistration.builder()
                .event(event)
                .user(user)
                .registrationDate(LocalDateTime.now())
                .build();
        registration = eventRegistrationRepository.save(registration);
        return toRegDto(registration);
    }

    // List registered events for user
    public List<EventRegistrationDto> getRegisteredEvents(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return eventRegistrationRepository.findByUser(user)
                .stream()
                .map(this::toRegDto)
                .collect(Collectors.toList());
    }

    // Submit feedback for an event
    public EventRegistrationDto submitFeedback(Long eventId, String username, String feedback) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        EventRegistration reg = eventRegistrationRepository.findByEventAndUser(event, user)
                .orElseThrow(() -> new RuntimeException("Not registered for this event"));
        reg.setFeedback(feedback);
        return toRegDto(eventRegistrationRepository.save(reg));
    }

    private EventDto toDto(Event event) {
        return EventDto.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .venue(event.getVenue())
                .capacity(event.getCapacity())
                .organizer(event.getOrganizer())
                .approved(event.isApproved())
                .build();
    }

    private EventRegistrationDto toRegDto(EventRegistration reg) {
        return EventRegistrationDto.builder()
                .id(reg.getId())
                .event(eventService.toDto(reg.getEvent()))  // Include full event details
                .registrationDate(reg.getRegistrationDate())
                .feedback(reg.getFeedback())
                .attended(reg.isAttended())
                .certificateIssued(reg.isCertificateIssued())
                .build();
    }
}