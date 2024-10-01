import { UUID } from "crypto";

export interface Question {
    question_id: UUID,
    asker_id?: UUID,
    related_project_id?: UUID,
    title: string,
    description: string,
    created_at: Date
}