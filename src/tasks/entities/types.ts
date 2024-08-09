import { registerEnumType } from "@nestjs/graphql";

export enum Status {
    ACTIVE = 'ACTIVE',
    DONE = 'DONE',
    ARCHIVED = 'ARCHIVED',
    IN_PROGERES = 'IN PROGERES'
}

registerEnumType(Status, {
    name: 'Status',
    description: 'Task status'
})