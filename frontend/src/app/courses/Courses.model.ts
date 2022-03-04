export class Issue {
    id!: number;
    title!: string;
    state!: string;
    url!: string;
    created_at!: string;
    updated_at!: string;
  }

export class Course {
  course_id: number;
  course_name: string;
  course_year: number;
  course_sem: number;
}
