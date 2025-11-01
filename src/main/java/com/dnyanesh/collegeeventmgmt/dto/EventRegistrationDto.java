package com.dnyanesh.collegeeventmgmt.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRegistrationDto {
    private Long id;
    private EventDto event;  // Include full event details
    private LocalDateTime registrationDate;
    private String feedback;
    private boolean attended;
    private boolean certificateIssued;
}