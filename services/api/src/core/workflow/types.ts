import { WorkflowType } from '@/types/workflow';

export const ATTENDANCE_SESSION_WORKFLOW: WorkflowType = {
  id: 'attendance_session',
  name: 'Attendance Session',
  description: 'Workflow for managing lecture attendance sessions',
  states: [
    {
      id: 'created',
      name: 'Created',
      description: 'Session created but not yet open for marking',
      isInitial: true,
      isFinal: false,
      permissions: ['teacher', 'admin'],
      timeouts: {
        after: 1, // 1 hour before start
        transitionTo: 'open'
      }
    },
    {
      id: 'open',
      name: 'Open',
      description: 'Attendance marking is open',
      isInitial: false,
      isFinal: false,
      permissions: ['teacher', 'student'],
      timeouts: {
        after: 2, // 2 hours after scheduled end
        transitionTo: 'closed'
      }
    },
    {
      id: 'closed',
      name: 'Closed',
      description: 'Attendance marking closed, pending finalization',
      isInitial: false,
      isFinal: false,
      permissions: ['teacher', 'admin']
    },
    {
      id: 'finalised',
      name: 'Finalised',
      description: 'Attendance finalized and locked',
      isInitial: false,
      isFinal: true,
      permissions: ['admin']
    },
    {
      id: 'locked',
      name: 'Locked',
      description: 'Permanently locked for audit',
      isInitial: false,
      isFinal: true,
      permissions: ['admin']
    }
  ],
  transitions: [
    {
      id: 'create_to_open',
      from: 'created',
      to: 'open',
      name: 'Open Session',
      description: 'Open attendance for marking',
      guard: 'attendance.open',
      conditions: [
        {
          type: 'time',
          operator: 'greater_than',
          field: 'scheduled_start',
          value: 'now'
        }
      ],
      actions: [
        {
          type: 'notification',
          config: {
            template: 'attendance_open',
            recipients: ['assigned_students']
          }
        }
      ]
    },
    {
      id: 'open_to_closed',
      from: 'open',
      to: 'closed',
      name: 'Close Session',
      description: 'Close attendance marking',
      guard: 'attendance.close',
      conditions: [
        {
          type: 'time',
          operator: 'greater_than',
          field: 'scheduled_end',
          value: 'now'
        }
      ]
    },
    {
      id: 'closed_to_finalised',
      from: 'closed',
      to: 'finalised',
      name: 'Finalise Attendance',
      description: 'Finalize attendance records',
      guard: 'attendance.finalise',
      actions: [
        {
          type: 'automation',
          config: {
            action: 'update_student_track_reports',
            params: ['attendance_data']
          }
        }
      ]
    },
    {
      id: 'finalised_to_locked',
      from: 'finalised',
      to: 'locked',
      name: 'Lock Records',
      description: 'Permanently lock attendance records',
      guard: 'attendance.lock'
    }
  ],
  permissions: [
    {
      role: 'teacher',
      permissions: ['create', 'read', 'update', 'transition'],
      conditions: {
        assigned_subject: true
      }
    },
    {
      role: 'student',
      permissions: ['read'],
      conditions: {
        enrolled_subject: true
      }
    },
    {
      role: 'admin',
      permissions: ['create', 'read', 'update', 'transition', 'delete', 'lock']
    }
  ],
  automations: [
    {
      trigger: 'state_change',
      condition: 'currentState == "closed"',
      action: 'calculate_attendance_stats',
      config: {}
    },
    {
      trigger: 'deadline',
      condition: 'dueDate < now',
      action: 'escalate_to_admin',
      config: {}
    }
  ],
  metadata: {
    category: 'academic',
    criticality: 'high',
    retention_years: 7
  }
};

export const ASSIGNMENT_WORKFLOW: WorkflowType = {
  id: 'assignment',
  name: 'Assignment',
  description: 'Workflow for managing assignments and submissions',
  states: [
    {
      id: 'created',
      name: 'Created',
      description: 'Assignment created but not yet published',
      isInitial: true,
      isFinal: false,
      permissions: ['teacher', 'admin']
    },
    {
      id: 'assigned',
      name: 'Assigned',
      description: 'Assignment published and visible to students',
      isInitial: false,
      isFinal: false,
      permissions: ['teacher', 'student', 'admin']
    },
    {
      id: 'submission_open',
      name: 'Submission Open',
      description: 'Students can submit assignments',
      isInitial: false,
      isFinal: false,
      permissions: ['teacher', 'student', 'admin']
    },
    {
      id: 'submission_closed',
      name: 'Submission Closed',
      description: 'Submission deadline passed',
      isInitial: false,
      isFinal: false,
      permissions: ['teacher', 'admin']
    },
    {
      id: 'evaluation',
      name: 'Under Evaluation',
      description: 'Assignments being evaluated',
      isInitial: false,
      isFinal: false,
      permissions: ['teacher', 'admin']
    },
    {
      id: 'evaluated',
      name: 'Evaluated',
      description: 'All submissions evaluated',
      isInitial: false,
      isFinal: false,
      permissions: ['teacher', 'student', 'admin']
    },
    {
      id: 'finalised',
      name: 'Finalised',
      description: 'Marks finalized and submitted',
      isInitial: false,
      isFinal: true,
      permissions: ['admin']
    },
    {
      id: 'locked',
      name: 'Locked',
      description: 'Permanently locked for audit',
      isInitial: false,
      isFinal: true,
      permissions: ['admin']
    }
  ],
  transitions: [
    {
      id: 'create_to_assigned',
      from: 'created',
      to: 'assigned',
      name: 'Publish Assignment',
      description: 'Make assignment visible to students',
      guard: 'assignment.publish'
    },
    {
      id: 'assigned_to_submission',
      from: 'assigned',
      to: 'submission_open',
      name: 'Open Submissions',
      description: 'Open assignment for submissions',
      guard: 'assignment.open_submissions'
    },
    {
      id: 'submission_to_closed',
      from: 'submission_open',
      to: 'submission_closed',
      name: 'Close Submissions',
      description: 'Close submission window',
      conditions: [
        {
          type: 'time',
          operator: 'greater_than',
          field: 'deadline',
          value: 'now'
        }
      ]
    },
    {
      id: 'closed_to_evaluation',
      from: 'submission_closed',
      to: 'evaluation',
      name: 'Start Evaluation',
      description: 'Begin evaluating submissions',
      guard: 'assignment.evaluate'
    },
    {
      id: 'evaluation_to_evaluated',
      from: 'evaluation',
      to: 'evaluated',
      name: 'Complete Evaluation',
      description: 'All submissions evaluated',
      guard: 'assignment.complete_evaluation'
    },
    {
      id: 'evaluated_to_finalised',
      from: 'evaluated',
      to: 'finalised',
      name: 'Finalise Marks',
      description: 'Finalize assignment marks',
      guard: 'assignment.finalise',
      actions: [
        {
          type: 'automation',
          config: {
            action: 'update_internal_marks',
            params: ['assignment_marks']
          }
        }
      ]
    }
  ],
  permissions: [
    {
      role: 'teacher',
      permissions: ['create', 'read', 'update', 'transition'],
      conditions: {
        assigned_subject: true
      }
    },
    {
      role: 'student',
      permissions: ['read', 'update'], // update for submission
      conditions: {
        enrolled_subject: true
      }
    },
    {
      role: 'admin',
      permissions: ['create', 'read', 'update', 'transition', 'delete', 'lock']
    }
  ],
  automations: [
    {
      trigger: 'deadline',
      condition: 'deadline < now AND currentState == "submission_open"',
      action: 'auto_close_submissions',
      config: {}
    },
    {
      trigger: 'state_change',
      condition: 'currentState == "evaluated"',
      action: 'notify_students',
      config: {
        template: 'assignment_evaluated'
      }
    }
  ],
  metadata: {
    category: 'academic',
    criticality: 'high',
    retention_years: 7
  }
};

export const INTERNAL_MARKS_WORKFLOW: WorkflowType = {
  id: 'internal_marks',
  name: 'Internal Marks',
  description: 'Workflow for managing internal assessment marks',
  states: [
    {
      id: 'draft',
      name: 'Draft',
      description: 'Marks in draft stage, not visible to students',
      isInitial: true,
      isFinal: false,
      permissions: ['teacher']
    },
    {
      id: 'submitted',
      name: 'Submitted',
      description: 'Marks submitted for review',
      isInitial: false,
      isFinal: false,
      permissions: ['teacher', 'admin']
    },
    {
      id: 'under_review',
      name: 'Under Review',
      description: 'Marks being reviewed by HOD/admin',
      isInitial: false,
      isFinal: false,
      permissions: ['admin', 'hod']
    },
    {
      id: 'finalised',
      name: 'Finalised',
      description: 'Marks finalized and visible to students',
      isInitial: false,
      isFinal: true,
      permissions: ['admin', 'teacher', 'student']
    },
    {
      id: 'locked',
      name: 'Locked',
      description: 'Permanently locked for audit',
      isInitial: false,
      isFinal: true,
      permissions: ['admin']
    }
  ],
  transitions: [
    {
      id: 'draft_to_submitted',
      from: 'draft',
      to: 'submitted',
      name: 'Submit Marks',
      description: 'Submit marks for departmental review',
      guard: 'marks.submit'
    },
    {
      id: 'submitted_to_review',
      from: 'submitted',
      to: 'under_review',
      name: 'Start Review',
      description: 'Begin marks review process',
      guard: 'marks.review'
    },
    {
      id: 'review_to_finalised',
      from: 'under_review',
      to: 'finalised',
      name: 'Finalise Marks',
      description: 'Finalize marks after review',
      guard: 'marks.finalise',
      actions: [
        {
          type: 'automation',
          config: {
            action: 'update_student_track_reports',
            params: ['marks_data']
          }
        },
        {
          type: 'notification',
          config: {
            template: 'marks_finalised',
            recipients: ['students']
          }
        }
      ]
    },
    {
      id: 'finalised_to_locked',
      from: 'finalised',
      to: 'locked',
      name: 'Lock Marks',
      description: 'Permanently lock marks',
      guard: 'marks.lock'
    }
  ],
  permissions: [
    {
      role: 'teacher',
      permissions: ['create', 'read', 'update', 'transition'],
      conditions: {
        assigned_subject: true
      }
    },
    {
      role: 'student',
      permissions: ['read'],
      conditions: {
        enrolled_subject: true,
        status: 'finalised'
      }
    },
    {
      role: 'admin',
      permissions: ['create', 'read', 'update', 'transition', 'delete', 'lock']
    }
  ],
  automations: [
    {
      trigger: 'state_change',
      condition: 'currentState == "finalised"',
      action: 'calculate_eligibility',
      config: {}
    }
  ],
  metadata: {
    category: 'academic',
    criticality: 'high',
    retention_years: 7
  }
};

export const LEAVE_REQUEST_WORKFLOW: WorkflowType = {
  id: 'leave_request',
  name: 'Leave Request',
  description: 'Workflow for managing student leave requests',
  states: [
    {
      id: 'created',
      name: 'Created',
      description: 'Leave request created',
      isInitial: true,
      isFinal: false,
      permissions: ['student']
    },
    {
      id: 'under_review',
      name: 'Under Review',
      description: 'Leave request being reviewed',
      isInitial: false,
      isFinal: false,
      permissions: ['teacher', 'admin']
    },
    {
      id: 'approved',
      name: 'Approved',
      description: 'Leave request approved',
      isInitial: false,
      isFinal: true,
      permissions: ['student', 'teacher', 'admin']
    },
    {
      id: 'rejected',
      name: 'Rejected',
      description: 'Leave request rejected',
      isInitial: false,
      isFinal: true,
      permissions: ['student', 'teacher', 'admin']
    },
    {
      id: 'emergency',
      name: 'Emergency',
      description: 'Emergency leave approved',
      isInitial: false,
      isFinal: true,
      permissions: ['admin', 'student']
    }
  ],
  transitions: [
    {
      id: 'create_to_review',
      from: 'created',
      to: 'under_review',
      name: 'Submit Request',
      description: 'Submit leave request for review',
      guard: 'leave.submit'
    },
    {
      id: 'review_to_approved',
      from: 'under_review',
      to: 'approved',
      name: 'Approve Leave',
      description: 'Approve leave request',
      guard: 'leave.approve',
      actions: [
        {
          type: 'automation',
          config: {
            action: 'update_attendance_records',
            params: ['leave_dates']
          }
        }
      ]
    },
    {
      id: 'review_to_rejected',
      from: 'under_review',
      to: 'rejected',
      name: 'Reject Leave',
      description: 'Reject leave request',
      guard: 'leave.reject'
    },
    {
      id: 'create_to_emergency',
      from: 'created',
      to: 'emergency',
      name: 'Emergency Approval',
      description: 'Emergency leave approval',
      guard: 'leave.emergency',
      conditions: [
        {
          type: 'attribute',
          operator: 'equals',
          field: 'leave_type',
          value: 'emergency'
        }
      ]
    }
  ],
  permissions: [
    {
      role: 'student',
      permissions: ['create', 'read', 'update']
    },
    {
      role: 'teacher',
      permissions: ['read', 'transition'],
      conditions: {
        assigned_student: true
      }
    },
    {
      role: 'admin',
      permissions: ['create', 'read', 'update', 'transition', 'delete']
    }
  ],
  automations: [
    {
      trigger: 'state_change',
      condition: 'currentState == "approved"',
      action: 'update_attendance',
      config: {}
    }
  ],
  metadata: {
    category: 'administrative',
    criticality: 'medium',
    retention_years: 5
  }
};

export const STUDENT_TRACK_REPORT_WORKFLOW: WorkflowType = {
  id: 'student_track_report',
  name: 'Student Track Report',
  description: 'Workflow for comprehensive student academic tracking',
  states: [
    {
      id: 'draft',
      name: 'Draft',
      description: 'Report being compiled',
      isInitial: true,
      isFinal: false,
      permissions: ['admin', 'system']
    },
    {
      id: 'submitted',
      name: 'Submitted',
      description: 'Report submitted for student visibility',
      isInitial: false,
      isFinal: false,
      permissions: ['admin', 'student']
    },
    {
      id: 'under_review',
      name: 'Under Review',
      description: 'Student can request clarifications',
      isInitial: false,
      isFinal: false,
      permissions: ['admin', 'student']
    },
    {
      id: 'finalised',
      name: 'Finalised',
      description: 'Report finalized for examination eligibility',
      isInitial: false,
      isFinal: true,
      permissions: ['admin', 'student']
    },
    {
      id: 'locked',
      name: 'Locked',
      description: 'Permanently locked for audit',
      isInitial: false,
      isFinal: true,
      permissions: ['admin']
    }
  ],
  transitions: [
    {
      id: 'draft_to_submitted',
      from: 'draft',
      to: 'submitted',
      name: 'Submit Report',
      description: 'Submit report for student review',
      guard: 'track.submit',
      actions: [
        {
          type: 'automation',
          config: {
            action: 'compile_report_data',
            params: ['attendance', 'assignments', 'marks']
          }
        }
      ]
    },
    {
      id: 'submitted_to_review',
      from: 'submitted',
      to: 'under_review',
      name: 'Open Review Window',
      description: 'Open student clarification window',
      guard: 'track.open_review'
    },
    {
      id: 'review_to_finalised',
      from: 'under_review',
      to: 'finalised',
      name: 'Finalise Report',
      description: 'Finalize track report',
      guard: 'track.finalise'
    },
    {
      id: 'finalised_to_locked',
      from: 'finalised',
      to: 'locked',
      name: 'Lock Report',
      description: 'Permanently lock report',
      guard: 'track.lock'
    }
  ],
  permissions: [
    {
      role: 'student',
      permissions: ['read', 'update'], // update for clarification requests
      conditions: {
        own_report: true
      }
    },
    {
      role: 'admin',
      permissions: ['create', 'read', 'update', 'transition', 'delete', 'lock']
    }
  ],
  automations: [
    {
      trigger: 'deadline',
      condition: 'review_deadline < now',
      action: 'auto_finalise',
      config: {}
    }
  ],
  metadata: {
    category: 'governance',
    criticality: 'high',
    retention_years: 10
  }
};

// Export all workflow types
export const WORKFLOW_TYPES = {
  attendance_session: ATTENDANCE_SESSION_WORKFLOW,
  assignment: ASSIGNMENT_WORKFLOW,
  internal_marks: INTERNAL_MARKS_WORKFLOW,
  leave_request: LEAVE_REQUEST_WORKFLOW,
  student_track_report: STUDENT_TRACK_REPORT_WORKFLOW
};