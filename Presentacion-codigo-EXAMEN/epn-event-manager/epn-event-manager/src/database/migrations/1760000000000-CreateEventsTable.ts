import { MigrationInterface, QueryRunner } from 'typeorm';
import { EventAction } from '../entities/event.entity';

interface LegacyEventRow {
  source: string | null;
  entity: string | null;
  action: string | null;
  title: string | null;
  description: string | null;
  payload: string | null;
  legacy_date: string | null;
}

export class CreateEventsTable1760000000000 implements MigrationInterface {
  name = 'CreateEventsTable1760000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "events" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "source" varchar NOT NULL,
        "entity" varchar NOT NULL,
        "action" text NOT NULL,
        "title" varchar NOT NULL,
        "description" text,
        "payload" text NOT NULL,
        "created_at" text NOT NULL
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_events_source" ON "events" ("source")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_events_entity" ON "events" ("entity")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_events_created_at" ON "events" ("created_at")`,
    );

    await this.migrateLegacyTable(
      queryRunner,
      'create_events',
      EventAction.Create,
      'recorded_at',
      true,
    );
    await this.migrateLegacyTable(
      queryRunner,
      'update_events',
      EventAction.Update,
      'timestamp',
      true,
    );
    await this.migrateLegacyTable(
      queryRunner,
      'delete_events',
      EventAction.Delete,
      'createdAt',
      false,
    );
    await this.migrateLegacyTable(
      queryRunner,
      'query_events',
      EventAction.Query,
      'event_date',
      true,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "events"`);
  }

  private async migrateLegacyTable(
    queryRunner: QueryRunner,
    tableName: string,
    fallbackAction: EventAction,
    dateColumn: string,
    hasDescription: boolean,
  ): Promise<void> {
    const hasTable = await queryRunner.hasTable(tableName);
    if (!hasTable) {
      return;
    }

    const descriptionColumn = hasDescription
      ? '"description" AS description'
      : 'NULL AS description';
    const rows = (await queryRunner.query(`
      SELECT
        "source",
        "entity",
        "action",
        "title",
        ${descriptionColumn},
        "payload",
        "${dateColumn}" AS legacy_date
      FROM "${tableName}"
    `)) as LegacyEventRow[];

    for (const row of rows) {
      await queryRunner.query(
        `
        INSERT INTO "events"
          ("source", "entity", "action", "title", "description", "payload", "created_at")
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          row.source ?? 'unknown',
          row.entity ?? 'unknown',
          normalizeAction(row.action, fallbackAction),
          row.title ?? fallbackAction,
          row.description,
          row.payload ?? '{}',
          normalizeDate(row.legacy_date),
        ],
      );
    }
  }
}

function normalizeAction(
  value: string | null,
  fallbackAction: EventAction,
): EventAction {
  const normalized = value?.toUpperCase();
  if (Object.values(EventAction).includes(normalized as EventAction)) {
    return normalized as EventAction;
  }
  return fallbackAction;
}

function normalizeDate(value: string | null): string {
  if (!value) {
    return new Date().toISOString();
  }

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return new Date().toISOString();
  }

  return new Date(timestamp).toISOString();
}
