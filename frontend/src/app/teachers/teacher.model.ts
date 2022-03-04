import { Subject } from "../subjects/subject.models";

export class Teacher {
  teacher_id: number;
  firstname: string;
  lastname: string;
  subject: Subject | null;
}
