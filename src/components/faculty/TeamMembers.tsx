'use client';

import React from 'react';
import { TeamMember } from '@/types';
import { Avatar } from './Avatar';
import { UserPlus, MoreHorizontal, CheckCircle2, Clock } from 'lucide-react';

interface TeamMembersProps {
  members: TeamMember[];
  onMemberClick?: (member: TeamMember) => void;
}

export function TeamMembers({ members, onMemberClick }: TeamMembersProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900">Team Members</h3>
          <p className="text-xs text-gray-500">Your department colleagues</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
          <UserPlus className="w-3.5 h-3.5" />
          Invite
        </button>
      </div>
      
      {/* Members Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {members.map((member, idx) => (
          <button
            key={member.id}
            onClick={() => onMemberClick?.(member)}
            style={{ animationDelay: `${idx * 50}ms` }}
            className="
              p-3 
              rounded-xl 
              border border-gray-100 
              hover:border-blue-200 
              hover:shadow-md 
              hover:-translate-y-0.5
              transition-all duration-200
              group
              text-left
              animate-fade-in-up
            "
          >
            <div className="flex justify-center mb-3">
              <Avatar 
                name={member.name} 
                size="lg" 
                showStatus 
                isOnline={member.isOnline}
              />
            </div>
            
            <h4 className="font-medium text-gray-900 text-xs text-center truncate">
              {member.name.split(' ')[0]}
            </h4>
            <p className="text-[10px] text-gray-500 text-center truncate">
              {member.role}
            </p>
            
            <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-gray-50">
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span>{member.tasksCompleted}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>{member.tasksAssigned}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
