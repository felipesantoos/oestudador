-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

--------------------------------------------------------------------------------
-- 1. Core Entities
--------------------------------------------------------------------------------

-- 1.1 Users
CREATE TABLE users (
  id                        UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT users_pkey PRIMARY KEY,
  name                      TEXT      NOT NULL,
  email                     TEXT      NOT NULL
    CONSTRAINT users_email_key UNIQUE,
  password_hash             TEXT      NOT NULL,
  avatar_url                TEXT,
  role                      TEXT      NOT NULL
    CONSTRAINT users_role_check CHECK (role IN ('student','admin','moderator')),
  is_email_verified         BOOLEAN   NOT NULL DEFAULT FALSE,
  email_verification_token  TEXT,
  email_verification_sent_at TIMESTAMP,
  password_reset_token      TEXT,
  password_reset_expires_at TIMESTAMP,
  login_attempts            INTEGER   NOT NULL DEFAULT 0,
  locked_until              TIMESTAMP,
  two_factor_enabled        BOOLEAN   NOT NULL DEFAULT FALSE,
  two_factor_secret         TEXT,
  session_token             TEXT,
  timezone                  TEXT,
  language                  TEXT,
  birth_date                DATE,
  notifications_enabled     BOOLEAN   NOT NULL DEFAULT TRUE,
  auth_provider             TEXT,
  last_login_at             TIMESTAMP,
  created_at                TIMESTAMP  NOT NULL DEFAULT now(),
  updated_at                TIMESTAMP  NOT NULL DEFAULT now(),
  deleted_at                TIMESTAMP
);

-- 1.2 Objectives
CREATE TABLE objectives (
  id         UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT objectives_pkey PRIMARY KEY,
  name       TEXT      NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP
);

-- 1.3 Plan Statuses
CREATE TABLE plan_statuses (
  id         UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT plan_statuses_pkey PRIMARY KEY,
  name       TEXT      NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP
);

-- 1.4 Exam Styles
CREATE TABLE exam_styles (
  id         UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT exam_styles_pkey PRIMARY KEY,
  name       TEXT      NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- 1.5 Notification Types
CREATE TABLE notification_types (
  id         UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT notification_types_pkey PRIMARY KEY,
  name       TEXT      NOT NULL,
  description TEXT,
  icon       TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- 1.6 Resource Types
CREATE TABLE resource_types (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT resource_types_pkey PRIMARY KEY,
  name        TEXT      NOT NULL,
  description TEXT,
  icon        TEXT,
  color       TEXT,
  is_active   BOOLEAN   NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMP
);

-- 1.7 Study Categories
CREATE TABLE study_categories (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT study_categories_pkey PRIMARY KEY,
  name        TEXT      NOT NULL,
  description TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMP
);

-- 1.8 Study Goal Types
CREATE TABLE study_goal_types (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT study_goal_types_pkey PRIMARY KEY,
  name        TEXT      NOT NULL,
  description TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT now()
);

-- 1.9 Study Periods
CREATE TABLE study_periods (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT study_periods_pkey PRIMARY KEY,
  name        TEXT      NOT NULL,
  description TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT now()
);

-- 1.10 Mood Types
CREATE TABLE mood_types (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT mood_types_pkey PRIMARY KEY,
  name        TEXT      NOT NULL,
  emoji       TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT now()
);

-- 1.11 Energy Levels
CREATE TABLE energy_levels (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT energy_levels_pkey PRIMARY KEY,
  value       INTEGER   NOT NULL
    CONSTRAINT energy_levels_value_check CHECK (value BETWEEN 0 AND 10),
  description TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT now()
);

-- 1.12 Achievements
CREATE TABLE achievements (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT achievements_pkey PRIMARY KEY,
  name        TEXT      NOT NULL,
  description TEXT,
  icon        TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT now()
);

-- 1.13 Topic Relation Types
CREATE TABLE topic_relation_types (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT topic_relation_types_pkey PRIMARY KEY,
  name        TEXT      NOT NULL,
  description TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT now()
);

-- 1.14 Schedulers
CREATE TABLE schedulers (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT schedulers_pkey PRIMARY KEY,
  name        TEXT      NOT NULL,
  description TEXT,
  is_active   BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT now()
);

--------------------------------------------------------------------------------
-- 2. Simple Reference Tables
--------------------------------------------------------------------------------

-- 2.1 Tags
CREATE TABLE tags (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT tags_pkey PRIMARY KEY,
  user_id     UUID      NOT NULL
    CONSTRAINT tags_user_id_fkey REFERENCES users(id),
  name        TEXT      NOT NULL,
  color       TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT now()
);

-- 2.2 Note Types
CREATE TABLE note_types (
  id               UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT note_types_pkey PRIMARY KEY,
  user_id          UUID      NOT NULL
    CONSTRAINT note_types_user_id_fkey REFERENCES users(id),
  name             TEXT      NOT NULL,
  is_cloze         BOOLEAN   NOT NULL DEFAULT FALSE,
  template_front   TEXT      NOT NULL,
  template_back    TEXT      NOT NULL,
  css              TEXT,
  created_at       TIMESTAMP NOT NULL DEFAULT now(),
  updated_at       TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at       TIMESTAMP
);

-- 2.3 Notes
CREATE TABLE notes (
  id             UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT notes_pkey PRIMARY KEY,
  user_id        UUID      NOT NULL
    CONSTRAINT notes_user_id_fkey REFERENCES users(id),
  note_type_id   UUID      NOT NULL
    CONSTRAINT notes_note_type_id_fkey REFERENCES note_types(id),
  fields         JSON      NOT NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT now(),
  updated_at     TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at     TIMESTAMP
);

-- 2.4 Note Fields
CREATE TABLE note_fields (
  id             UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT note_fields_pkey PRIMARY KEY,
  note_type_id   UUID      NOT NULL
    CONSTRAINT note_fields_note_type_id_fkey REFERENCES note_types(id),
  name           TEXT      NOT NULL,
  field_order    INTEGER   NOT NULL,
  required       BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMP NOT NULL DEFAULT now()
);

-- 2.5 Card Instances
CREATE TABLE card_instances (
  id             UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT card_instances_pkey PRIMARY KEY,
  note_id        UUID      NOT NULL
    CONSTRAINT card_instances_note_id_fkey REFERENCES notes(id),
  card_ordinal   INTEGER   NOT NULL,
  queue          INTEGER   NOT NULL,
  type           INTEGER   NOT NULL,
  due            INTEGER,
  interval       INTEGER,
  factor         INTEGER,
  reps           INTEGER,
  lapses         INTEGER,
  last_reviewed  TIMESTAMP,
  next_review    TIMESTAMP,
  created_at     TIMESTAMP NOT NULL DEFAULT now(),
  updated_at     TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at     TIMESTAMP
);

-- 2.6 Card Reviews
CREATE TABLE card_reviews (
  id                 UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT card_reviews_pkey PRIMARY KEY,
  card_instance_id   UUID      NOT NULL
    CONSTRAINT card_reviews_card_instance_id_fkey REFERENCES card_instances(id),
  user_id            UUID      NOT NULL
    CONSTRAINT card_reviews_user_id_fkey REFERENCES users(id),
  ease               INTEGER   NOT NULL,
  time_taken_ms      INTEGER,
  reviewed_at        TIMESTAMP NOT NULL DEFAULT now()
);

-- 2.7 Card Tags
CREATE TABLE card_tags (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT card_tags_pkey PRIMARY KEY,
  note_id     UUID      NOT NULL
    CONSTRAINT card_tags_note_id_fkey REFERENCES notes(id),
  tag_id      UUID      NOT NULL
    CONSTRAINT card_tags_tag_id_fkey REFERENCES tags(id),
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMP
);

-- 2.8 Media Files
CREATE TABLE media_files (
  id           UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT media_files_pkey PRIMARY KEY,
  user_id      UUID      NOT NULL
    CONSTRAINT media_files_user_id_fkey REFERENCES users(id),
  filename     TEXT      NOT NULL,
  mime_type    TEXT,
  path         TEXT      NOT NULL,
  uploaded_at  TIMESTAMP NOT NULL DEFAULT now()
);

-- 2.9 Sync Logs
CREATE TABLE sync_logs (
  id            UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT sync_logs_pkey PRIMARY KEY,
  user_id       UUID      NOT NULL
    CONSTRAINT sync_logs_user_id_fkey REFERENCES users(id),
  device_name   TEXT,
  last_sync_at  TIMESTAMP NOT NULL DEFAULT now()
);

-- 2.10 Add‑ons
CREATE TABLE addons (
  id           UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT addons_pkey PRIMARY KEY,
  name         TEXT      NOT NULL,
  description  TEXT,
  repo_url     TEXT,
  is_enabled   BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMP NOT NULL DEFAULT now()
);

-- 2.11 Settings
CREATE TABLE settings (
  id           UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT settings_pkey PRIMARY KEY,
  user_id      UUID      NOT NULL
    CONSTRAINT settings_user_id_fkey REFERENCES users(id),
  scheduler_id UUID      NOT NULL
    CONSTRAINT settings_scheduler_id_fkey REFERENCES schedulers(id),
  key          TEXT      NOT NULL,
  value        TEXT      NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT now(),
  updated_at   TIMESTAMP NOT NULL DEFAULT now()
);

-- 2.12 Data Exports
CREATE TABLE data_exports (
  id            UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT data_exports_pkey PRIMARY KEY,
  user_id       UUID      NOT NULL
    CONSTRAINT data_exports_user_id_fkey REFERENCES users(id),
  requested_at  TIMESTAMP NOT NULL DEFAULT now(),
  status        TEXT      NOT NULL,
  download_url  TEXT,
  format        TEXT,
  deleted_at    TIMESTAMP
);

-- 2.13 Data Imports
CREATE TABLE data_imports (
  id             UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT data_imports_pkey PRIMARY KEY,
  user_id        UUID      NOT NULL
    CONSTRAINT data_imports_user_id_fkey REFERENCES users(id),
  imported_at    TIMESTAMP NOT NULL DEFAULT now(),
  status         TEXT      NOT NULL,
  source_platform TEXT,
  summary        TEXT,
  deleted_at     TIMESTAMP
);

--------------------------------------------------------------------------------
-- 3. Plans, Templates & Related
--------------------------------------------------------------------------------

-- 3.1 Plans
CREATE TABLE plans (
  id               UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT plans_pkey PRIMARY KEY,
  user_id          UUID      NOT NULL
    CONSTRAINT plans_user_id_fkey REFERENCES users(id),
  objective_id     UUID      NOT NULL
    CONSTRAINT plans_objective_id_fkey REFERENCES objectives(id),
  plan_status_id   UUID      NOT NULL
    CONSTRAINT plans_plan_status_id_fkey REFERENCES plan_statuses(id),
  name             TEXT      NOT NULL,
  image_url        TEXT,
  notes            TEXT,
  start_date       DATE,
  end_date         DATE,
  weekly_hours     INTEGER,
  review_enabled   BOOLEAN   NOT NULL DEFAULT FALSE,
  review_intervals INTEGER[],
  created_at       TIMESTAMP NOT NULL DEFAULT now(),
  updated_at       TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at       TIMESTAMP
);

-- 3.2 Plan Templates
CREATE TABLE plan_templates (
  id               UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT plan_templates_pkey PRIMARY KEY,
  created_by       UUID      NOT NULL
    CONSTRAINT plan_templates_created_by_fkey REFERENCES users(id),
  objective_id     UUID      NOT NULL
    CONSTRAINT plan_templates_objective_id_fkey REFERENCES objectives(id),
  plan_status_id   UUID      NOT NULL
    CONSTRAINT plan_templates_plan_status_id_fkey REFERENCES plan_statuses(id),
  name             TEXT      NOT NULL,
  description      TEXT,
  image_url        TEXT,
  weekly_hours     INTEGER,
  review_enabled   BOOLEAN   NOT NULL DEFAULT FALSE,
  review_intervals INTEGER[],
  created_at       TIMESTAMP NOT NULL DEFAULT now(),
  updated_at       TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at       TIMESTAMP
);

-- 3.3 Plan Projections
CREATE TABLE plan_projections (
  id                  UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT plan_projections_pkey PRIMARY KEY,
  user_id             UUID      NOT NULL
    CONSTRAINT plan_projections_user_id_fkey REFERENCES users(id),
  plan_id             UUID      NOT NULL
    CONSTRAINT plan_projections_plan_id_fkey REFERENCES plans(id),
  projected_completion DATE,
  confidence          FLOAT,
  created_at          TIMESTAMP NOT NULL DEFAULT now(),
  updated_at          TIMESTAMP NOT NULL DEFAULT now()
);

-- 3.4 Exams & Associations
CREATE TABLE exams (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT exams_pkey PRIMARY KEY,
  name        TEXT      NOT NULL,
  institution TEXT,
  year        INTEGER,
  description TEXT,
  is_active   BOOLEAN   NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMP
);

CREATE TABLE plan_exams (
  plan_id     UUID      NOT NULL
    CONSTRAINT plan_exams_plan_id_fkey REFERENCES plans(id),
  exam_id     UUID      NOT NULL
    CONSTRAINT plan_exams_exam_id_fkey REFERENCES exams(id),
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT plan_exams_pkey PRIMARY KEY (plan_id, exam_id)
);

CREATE TABLE plan_template_exams (
  plan_template_id UUID NOT NULL
    CONSTRAINT plan_template_exams_plan_template_id_fkey REFERENCES plan_templates(id),
  exam_id          UUID NOT NULL
    CONSTRAINT plan_template_exams_exam_id_fkey REFERENCES exams(id),
  created_at       TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT plan_template_exams_pkey PRIMARY KEY (plan_template_id, exam_id)
);

-- 3.5 Roles & Associations
CREATE TABLE roles (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT roles_pkey PRIMARY KEY,
  name        TEXT      NOT NULL,
  description TEXT,
  is_active   BOOLEAN   NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMP
);

CREATE TABLE plan_roles (
  plan_id    UUID NOT NULL
    CONSTRAINT plan_roles_plan_id_fkey REFERENCES plans(id),
  role_id    UUID NOT NULL
    CONSTRAINT plan_roles_role_id_fkey REFERENCES roles(id),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT plan_roles_pkey PRIMARY KEY (plan_id, role_id)
);

CREATE TABLE plan_template_roles (
  plan_template_id UUID NOT NULL
    CONSTRAINT plan_template_roles_plan_template_id_fkey REFERENCES plan_templates(id),
  role_id          UUID NOT NULL
    CONSTRAINT plan_template_roles_role_id_fkey REFERENCES roles(id),
  created_at       TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT plan_template_roles_pkey PRIMARY KEY (plan_template_id, role_id)
);

--------------------------------------------------------------------------------
-- 4. Disciplines, Topics & Associations
--------------------------------------------------------------------------------

-- 4.1 Disciplines
CREATE TABLE disciplines (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT disciplines_pkey PRIMARY KEY,
  name        TEXT      NOT NULL,
  description TEXT,
  is_active   BOOLEAN   NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMP
);

-- 4.2 Discipline Templates
CREATE TABLE discipline_templates (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT discipline_templates_pkey PRIMARY KEY,
  created_by  UUID      NOT NULL
    CONSTRAINT discipline_templates_created_by_fkey REFERENCES users(id),
  name        TEXT      NOT NULL,
  description TEXT,
  color       TEXT,
  is_active   BOOLEAN   NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMP
);

-- 4.3 Plan Disciplines
CREATE TABLE plan_disciplines (
  plan_id       UUID NOT NULL
    CONSTRAINT plan_disciplines_plan_id_fkey REFERENCES plans(id),
  discipline_id UUID NOT NULL
    CONSTRAINT plan_disciplines_discipline_id_fkey REFERENCES disciplines(id),
  percentage    INTEGER,
  weekly_hours  INTEGER,
  color         TEXT,
  created_at    TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT plan_disciplines_pkey PRIMARY KEY (plan_id, discipline_id)
);

-- 4.4 Plan Template Disciplines
CREATE TABLE plan_template_disciplines (
  plan_template_id     UUID NOT NULL
    CONSTRAINT plan_template_disciplines_plan_template_id_fkey REFERENCES plan_templates(id),
  discipline_id        UUID NOT NULL
    CONSTRAINT plan_template_disciplines_discipline_id_fkey REFERENCES disciplines(id),
  discipline_template_id UUID NOT NULL
    CONSTRAINT plan_template_disciplines_dtemplate_id_fkey REFERENCES discipline_templates(id),
  percentage           INTEGER,
  weekly_hours         INTEGER,
  color                TEXT,
  created_at           TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT plan_template_disciplines_pkey PRIMARY KEY (plan_template_id, discipline_id)
);

-- 4.5 Topics
CREATE TABLE topics (
  id             UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT topics_pkey PRIMARY KEY,
  discipline_id  UUID      NOT NULL
    CONSTRAINT topics_discipline_id_fkey REFERENCES disciplines(id),
  name           TEXT      NOT NULL,
  description    TEXT,
  is_active      BOOLEAN   NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMP NOT NULL DEFAULT now(),
  updated_at     TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at     TIMESTAMP
);

-- 4.6 Plan Topics
CREATE TABLE plan_topics (
  plan_id   UUID NOT NULL
    CONSTRAINT plan_topics_plan_id_fkey REFERENCES plans(id),
  topic_id  UUID NOT NULL
    CONSTRAINT plan_topics_topic_id_fkey REFERENCES topics(id),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT plan_topics_pkey PRIMARY KEY (plan_id, topic_id)
);

-- 4.7 Plan Topic Links
CREATE TABLE plan_topic_links (
  id         UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT plan_topic_links_pkey PRIMARY KEY,
  plan_id    UUID      NOT NULL
    CONSTRAINT plan_topic_links_plan_id_fkey REFERENCES plans(id),
  topic_id   UUID      NOT NULL
    CONSTRAINT plan_topic_links_topic_id_fkey REFERENCES topics(id),
  title      TEXT,
  url        TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- 4.8 Plan Topic Tags
CREATE TABLE plan_topic_tags (
  id             UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT plan_topic_tags_pkey PRIMARY KEY,
  plan_id        UUID      NOT NULL,
  topic_id       UUID      NOT NULL,
  tag_id         UUID      NOT NULL
    CONSTRAINT plan_topic_tags_tag_id_fkey REFERENCES tags(id),
  created_at     TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT plan_topic_tags_fkey FOREIGN KEY (plan_id, topic_id)
    REFERENCES plan_topics(plan_id, topic_id)
);

-- 4.9 Scheduled Reviews
CREATE TABLE scheduled_reviews (
  id              UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT scheduled_reviews_pkey PRIMARY KEY,
  plan_id         UUID      NOT NULL
    CONSTRAINT scheduled_reviews_plan_id_fkey REFERENCES plans(id),
  topic_id        UUID      NOT NULL
    CONSTRAINT scheduled_reviews_topic_id_fkey REFERENCES topics(id),
  scheduled_date  DATE      NOT NULL,
  completed       BOOLEAN   NOT NULL DEFAULT FALSE,
  ignored         BOOLEAN   NOT NULL DEFAULT FALSE,
  completed_at    TIMESTAMP,
  created_at      TIMESTAMP NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT scheduled_reviews_plan_topic_date_key UNIQUE (plan_id, topic_id, scheduled_date)
);

-- 4.10 Plan Topic Resources
CREATE TABLE plan_topic_resources (
  id               UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT plan_topic_resources_pkey PRIMARY KEY,
  plan_id          UUID      NOT NULL
    CONSTRAINT plan_topic_resources_plan_id_fkey REFERENCES plans(id),
  topic_id         UUID      NOT NULL
    CONSTRAINT plan_topic_resources_topic_id_fkey REFERENCES topics(id),
  resource_type_id UUID      NOT NULL
    CONSTRAINT plan_topic_resources_resource_type_id_fkey REFERENCES resource_types(id),
  title            TEXT      NOT NULL,
  description      TEXT,
  url              TEXT,
  content          TEXT,
  "order"          INTEGER,
  created_at       TIMESTAMP NOT NULL DEFAULT now(),
  updated_at       TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at       TIMESTAMP
);

-- 4.11 Plan Topic Reviews
CREATE TABLE plan_topic_reviews (
  id               UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT plan_topic_reviews_pkey PRIMARY KEY,
  plan_id          UUID      NOT NULL
    CONSTRAINT plan_topic_reviews_plan_id_fkey REFERENCES plans(id),
  topic_id         UUID      NOT NULL
    CONSTRAINT plan_topic_reviews_topic_id_fkey REFERENCES topics(id),
  last_reviewed_at DATE,
  next_review_at   DATE,
  repetitions      INTEGER,
  easiness_factor  FLOAT,
  interval         INTEGER,
  created_at       TIMESTAMP NOT NULL DEFAULT now(),
  updated_at       TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at       TIMESTAMP
);

--------------------------------------------------------------------------------
-- 5. Study & Cycles
--------------------------------------------------------------------------------

-- 5.1 Study Cycles
CREATE TABLE study_cycles (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT study_cycles_pkey PRIMARY KEY,
  user_id     UUID      NOT NULL
    CONSTRAINT study_cycles_user_id_fkey REFERENCES users(id),
  name        TEXT      NOT NULL,
  description TEXT,
  is_active   BOOLEAN   NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMP
);

-- 5.2 Study Cycle Disciplines
CREATE TABLE study_cycle_disciplines (
  id              UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT study_cycle_disciplines_pkey PRIMARY KEY,
  study_cycle_id  UUID      NOT NULL
    CONSTRAINT study_cycle_disciplines_cycle_id_fkey REFERENCES study_cycles(id),
  discipline_id   UUID      NOT NULL
    CONSTRAINT study_cycle_disciplines_discipline_id_fkey REFERENCES disciplines(id),
  target_minutes  INTEGER,
  created_at      TIMESTAMP NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

-- 5.3 Study Notes
CREATE TABLE study_notes (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT study_notes_pkey PRIMARY KEY,
  user_id     UUID      NOT NULL
    CONSTRAINT study_notes_user_id_fkey REFERENCES users(id),
  date        DATE      NOT NULL,
  note        TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP NOT NULL DEFAULT now()
);

-- 5.4 Study Records
CREATE TABLE study_records (
  id               UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT study_records_pkey PRIMARY KEY,
  plan_id          UUID      NOT NULL,
  topic_id         UUID      NOT NULL,
  study_category_id UUID     NOT NULL
    CONSTRAINT study_records_study_category_id_fkey REFERENCES study_categories(id),
  study_time       TIME,
  material         TEXT,
  completed        BOOLEAN   NOT NULL DEFAULT FALSE,
  schedule_reviews BOOLEAN   NOT NULL DEFAULT FALSE,
  questions_right  INTEGER,
  questions_wrong  INTEGER,
  start_page       INTEGER,
  end_page         INTEGER,
  video_name       TEXT,
  video_start_time TIME,
  video_end_time   TIME,
  comment          TEXT,
  studied_at       DATE,
  created_at       TIMESTAMP NOT NULL DEFAULT now(),
  updated_at       TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT study_records_plan_topic_fkey FOREIGN KEY (plan_id, topic_id)
    REFERENCES plan_topics(plan_id, topic_id)
);

-- 5.5 Study Mood Tracking
CREATE TABLE study_mood_tracking (
  id               UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT study_mood_tracking_pkey PRIMARY KEY,
  user_id          UUID      NOT NULL
    CONSTRAINT study_mood_tracking_user_id_fkey REFERENCES users(id),
  study_record_id  UUID      NOT NULL
    CONSTRAINT study_mood_tracking_record_id_fkey REFERENCES study_records(id),
  mood_id          UUID      NOT NULL
    CONSTRAINT study_mood_tracking_mood_id_fkey REFERENCES mood_types(id),
  energy_level_id  UUID      NOT NULL
    CONSTRAINT study_mood_tracking_energy_id_fkey REFERENCES energy_levels(id),
  notes            TEXT,
  created_at       TIMESTAMP NOT NULL DEFAULT now()
);

-- 5.6 Study Goals
CREATE TABLE study_goals (
  id            UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT study_goals_pkey PRIMARY KEY,
  user_id       UUID      NOT NULL
    CONSTRAINT study_goals_user_id_fkey REFERENCES users(id),
  plan_id       UUID      NOT NULL
    CONSTRAINT study_goals_plan_id_fkey REFERENCES plans(id),
  goal_type_id  UUID      NOT NULL
    CONSTRAINT study_goals_goal_type_id_fkey REFERENCES study_goal_types(id),
  period_id     UUID      NOT NULL
    CONSTRAINT study_goals_period_id_fkey REFERENCES study_periods(id),
  target        INTEGER,
  start_date    TIMESTAMP,
  end_date      TIMESTAMP,
  created_at    TIMESTAMP NOT NULL DEFAULT now(),
  updated_at    TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMP
);

--------------------------------------------------------------------------------
-- 6. Simulated Exams
--------------------------------------------------------------------------------

-- 6.1 Simulated Exams
CREATE TABLE simulated_exams (
  id             UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT simulated_exams_pkey PRIMARY KEY,
  plan_id        UUID      NOT NULL
    CONSTRAINT simulated_exams_plan_id_fkey REFERENCES plans(id),
  exam_style_id  UUID      NOT NULL
    CONSTRAINT simulated_exams_style_id_fkey REFERENCES exam_styles(id),
  name           TEXT,
  board          TEXT,
  time_spent     TIME,
  simulated_at   DATE,
  created_at     TIMESTAMP NOT NULL DEFAULT now(),
  updated_at     TIMESTAMP NOT NULL DEFAULT now()
);

-- 6.2 Simulated Exam Disciplines
CREATE TABLE simulated_exam_disciplines (
  id                 UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT simulated_exam_disciplines_pkey PRIMARY KEY,
  simulated_exam_id  UUID      NOT NULL
    CONSTRAINT simulated_exam_disciplines_exam_id_fkey REFERENCES simulated_exams(id),
  discipline_id      UUID      NOT NULL
    CONSTRAINT simulated_exam_disciplines_discipline_id_fkey REFERENCES disciplines(id),
  weight             INTEGER,
  total_questions    INTEGER,
  correct_answers    INTEGER,
  wrong_answers      INTEGER,
  blank_answers      INTEGER,
  comment            TEXT,
  created_at         TIMESTAMP NOT NULL DEFAULT now(),
  updated_at         TIMESTAMP NOT NULL DEFAULT now()
);

--------------------------------------------------------------------------------
-- 7. Feedback & Scheduling
--------------------------------------------------------------------------------

-- 7.1 Resource Feedbacks
CREATE TABLE resource_feedbacks (
  id                        UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT resource_feedbacks_pkey PRIMARY KEY,
  user_id                   UUID      NOT NULL
    CONSTRAINT resource_feedbacks_user_id_fkey REFERENCES users(id),
  plan_topic_resource_id    UUID      NOT NULL
    CONSTRAINT resource_feedbacks_resource_id_fkey REFERENCES plan_topic_resources(id),
  rating                    INTEGER,
  comment                   TEXT,
  created_at                TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at                TIMESTAMP
);

-- 7.2 Study Calendar Events
CREATE TABLE study_calendar_events (
  id           UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT study_calendar_events_pkey PRIMARY KEY,
  user_id      UUID      NOT NULL
    CONSTRAINT study_calendar_events_user_id_fkey REFERENCES users(id),
  type         TEXT      NOT NULL,
  related_id   UUID,
  title        TEXT,
  start_time   TIMESTAMP,
  end_time     TIMESTAMP,
  color        TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMP
);

-- 7.3 Analysis Snapshots
CREATE TABLE analysis_snapshots (
  id             UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT analysis_snapshots_pkey PRIMARY KEY,
  user_id        UUID      NOT NULL
    CONSTRAINT analysis_snapshots_user_id_fkey REFERENCES users(id),
  period_start   DATE,
  period_end     DATE,
  summary_json   JSON,
  created_at     TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at     TIMESTAMP
);

-- 7.4 Favorite Resources
CREATE TABLE favorite_resources (
  id                     UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT favorite_resources_pkey PRIMARY KEY,
  user_id                UUID      NOT NULL
    CONSTRAINT favorite_resources_user_id_fkey REFERENCES users(id),
  plan_topic_resource_id UUID      NOT NULL
    CONSTRAINT favorite_resources_resource_id_fkey REFERENCES plan_topic_resources(id),
  favorited_at           TIMESTAMP NOT NULL DEFAULT now(),
  deleted_at             TIMESTAMP
);

-- 7.5 Study Assistant Messages
CREATE TABLE study_assistant_messages (
  id          UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT study_assistant_messages_pkey PRIMARY KEY,
  user_id     UUID      NOT NULL
    CONSTRAINT study_assistant_messages_user_id_fkey REFERENCES users(id),
  trigger_type TEXT     NOT NULL,
  message     TEXT      NOT NULL,
  action_url  TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT now()
);

--------------------------------------------------------------------------------
-- 8. Progress Logs & Relations
--------------------------------------------------------------------------------

-- 8.1 Progress Logs
CREATE TABLE progress_logs (
  id                  UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT progress_logs_pkey PRIMARY KEY,
  user_id             UUID      NOT NULL
    CONSTRAINT progress_logs_user_id_fkey REFERENCES users(id),
  plan_id             UUID      NOT NULL
    CONSTRAINT progress_logs_plan_id_fkey REFERENCES plans(id),
  date                DATE      NOT NULL,
  total_minutes       INTEGER,
  topics_completed    INTEGER,
  reviews_completed   INTEGER,
  questions_correct   INTEGER,
  questions_wrong     INTEGER,
  created_at          TIMESTAMP NOT NULL DEFAULT now()
);

-- 8.2 Topic Relations
CREATE TABLE topic_relations (
  id                 UUID      NOT NULL DEFAULT gen_random_uuid()
    CONSTRAINT topic_relations_pkey PRIMARY KEY,
  topic_id           UUID      NOT NULL
    CONSTRAINT topic_relations_topic_id_fkey REFERENCES topics(id),
  related_topic_id   UUID      NOT NULL
    CONSTRAINT topic_relations_related_topic_id_fkey REFERENCES topics(id),
  relation_type_id   UUID      NOT NULL
    CONSTRAINT topic_relations_type_id_fkey REFERENCES topic_relation_types(id),
  created_at         TIMESTAMP NOT NULL DEFAULT now(),
  updated_at         TIMESTAMP NOT NULL DEFAULT now()
);
