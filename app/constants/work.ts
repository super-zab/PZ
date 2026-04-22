import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: '2021',
    title: 'ESTP Paris',
    subtitle: 'Engineering Degree',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-3, -3, -1.5),
    year: '2023',
    title: 'EDHEC Business School',
    subtitle: 'Business & Finance (M1)',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-2, -1, -3),
    year: '2023',
    title: 'Vinci Energies',
    subtitle: 'Business Engineer Intern',
    position: 'left',
  },
  {
    point: new THREE.Vector3(2, -2, -4.5),
    year: '2023',
    title: 'MatchMyCoach',
    subtitle: 'Co-Founder & CEO',
    position: 'right',
  },
  {
    point: new THREE.Vector3(0, 1, -6),
    year: '2024',
    title: 'Sungkyunkwan University',
    subtitle: 'Finance Major (M1)',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-3, -1, -7.5),
    year: '2024',
    title: 'SKARLETT',
    subtitle: 'Right Hand of CEO',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1, 0, -9),
    year: '2025',
    title: 'Tenergie',
    subtitle: 'Analyst M&A Intern',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-1, 2, -10.5),
    year: '2026',
    title: 'UC Berkeley HAAS',
    subtitle: 'Business Entrepreneurship (Master)',
    position: 'left',
  },
  {
    point: new THREE.Vector3(2, -1, -12),
    year: '2026',
    title: 'David French & Associates',
    subtitle: 'Business Engineer Consultant',
    position: 'right',
  },
]
