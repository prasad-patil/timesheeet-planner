import { Teacher } from "src/app/teachers/teacher.model";

export class SubjectTeacher{
  subject_id: number;
  name: string;
  course_id: number;
  teacher: Teacher | null;
}
