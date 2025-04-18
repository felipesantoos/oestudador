```mermaid
erDiagram
    USERS ||--o{ PLANS : has
    USERS ||--o{ PLAN_TEMPLATES : created
    USERS ||--o{ DISCIPLINE_TEMPLATES : created
    OBJECTIVES ||--o{ PLANS : includes
    OBJECTIVES ||--o{ PLAN_TEMPLATES : includes
    PLAN_STATUSES ||--o{ PLANS : defines
    PLAN_STATUSES ||--o{ PLAN_TEMPLATES : defines
    PLANS ||--o{ PLAN_EXAMS : includes
    EXAMS ||--o{ PLAN_EXAMS : included_by
    PLAN_TEMPLATES ||--o{ PLAN_TEMPLATE_EXAMS : includes
    EXAMS ||--o{ PLAN_TEMPLATE_EXAMS : included_by
    PLANS ||--o{ PLAN_ROLES : linked_to
    ROLES ||--o{ PLAN_ROLES : contains
    PLAN_TEMPLATES ||--o{ PLAN_TEMPLATE_ROLES : linked_to
    ROLES ||--o{ PLAN_TEMPLATE_ROLES : contains
    PLANS ||--o{ PLAN_DISCIPLINES : has
    PLAN_TEMPLATES ||--o{ PLAN_TEMPLATE_DISCIPLINES : has
    DISCIPLINES ||--o{ PLAN_DISCIPLINES : defines
    DISCIPLINES ||--o{ PLAN_TEMPLATE_DISCIPLINES : defines
    DISCIPLINES ||--o{ TOPICS : contains
    DISCIPLINE_TEMPLATES ||--o{ PLAN_TEMPLATE_DISCIPLINES : defines
    DISCIPLINE_TEMPLATES ||--o{ TOPIC_TEMPLATES : contains
    PLANS ||--o{ PLAN_TOPICS : has
    TOPICS ||--o{ PLAN_TOPICS : defines
    PLAN_TOPICS ||--o{ STUDY_RECORDS : has
    PLAN_TOPICS ||--o{ SCHEDULED_REVIEWS : has
    STUDY_CATEGORIES ||--o{ STUDY_RECORDS : categorizes
    PLAN_TOPICS ||--o{ PLAN_TOPIC_LINKS : has
    PLAN_TOPIC_LINKS }o--|| PLAN_TOPICS : belongs_to
    USERS ||--o{ STUDY_CYCLES : owns
    STUDY_CYCLES ||--o{ STUDY_CYCLE_DISCIPLINES : includes
    DISCIPLINES ||--o{ STUDY_CYCLE_DISCIPLINES : defined_by
    PLANS ||--o{ SIMULATED_EXAMS : has
    EXAM_STYLES ||--o{ SIMULATED_EXAMS : defines
    SIMULATED_EXAMS ||--o{ SIMULATED_EXAM_DISCIPLINES : includes
    DISCIPLINES ||--o{ SIMULATED_EXAM_DISCIPLINES : included
    RESOURCE_TYPES ||--o{ PLAN_TOPIC_RESOURCES : defines
    PLAN_TOPICS ||--o{ PLAN_TOPIC_RESOURCES : has
    PLAN_TOPICS ||--o{ PLAN_TOPIC_REVIEWS : has
    USERS ||--o{ STUDY_GOALS : has
    STUDY_GOAL_TYPES ||--o{ STUDY_GOALS : defines
    STUDY_PERIODS ||--o{ STUDY_GOALS : defines
    USERS ||--o{ STUDY_NOTES : writes
    USERS ||--o{ STUDY_MOOD_TRACKING : records
    STUDY_RECORDS ||--o{ STUDY_MOOD_TRACKING : tracks
    MOOD_TYPES ||--o{ STUDY_MOOD_TRACKING : has
    ENERGY_LEVELS ||--o{ STUDY_MOOD_TRACKING : has
    USERS ||--o{ USER_ACHIEVEMENTS : earns
    ACHIEVEMENTS ||--o{ USER_ACHIEVEMENTS : achieved
    USERS ||--o{ PROGRESS_LOGS : has
    USERS ||--o{ PLAN_PROJECTIONS : owns
    PLANS ||--o{ PLAN_PROJECTIONS : projected_for
    TOPICS ||--o{ TOPIC_RELATIONS : origin
    TOPICS ||--o{ TOPIC_RELATIONS : target
    TOPIC_RELATION_TYPES ||--o{ TOPIC_RELATIONS : defines
    USERS ||--o{ FLASHCARDS : creates
    PLAN_TOPICS ||--o{ FLASHCARDS : has
    FLASHCARDS ||--o{ FLASHCARD_REVIEWS : reviewed_as
    USERS ||--o{ DATA_EXPORTS : requests
    USERS ||--o{ DATA_IMPORTS : uploads
    USERS ||--o{ NOTIFICATIONS : receives
    NOTIFICATION_TYPES ||--o{ NOTIFICATIONS : defines
    USERS ||--o{ TAGS : owns
    PLAN_TOPICS ||--o{ PLAN_TOPIC_TAGS : tagged_with
    TAGS ||--o{ PLAN_TOPIC_TAGS : used_on
    USERS ||--o{ STUDY_GROUPS : owns
    STUDY_GROUPS ||--o{ STUDY_GROUP_MEMBERS : includes
    USERS ||--o{ STUDY_GROUP_MEMBERS : participates
    USERS ||--o{ RESOURCE_FEEDBACKS : writes
    PLAN_TOPIC_RESOURCES ||--o{ RESOURCE_FEEDBACKS : receives
    USERS ||--o{ STUDY_CALENDAR_EVENTS : plans
    STUDY_CALENDAR_EVENTS ||--o{ STUDY_RECORDS : links
    STUDY_CALENDAR_EVENTS ||--o{ SCHEDULED_REVIEWS : links
    STUDY_CALENDAR_EVENTS ||--o{ SIMULATED_EXAMS : links
    USERS ||--o{ ANALYSIS_SNAPSHOTS : owns
    USERS ||--o{ FAVORITE_RESOURCES : marks
    PLAN_TOPIC_RESOURCES ||--o{ FAVORITE_RESOURCES : is_favorite
    USERS ||--o{ STUDY_ASSISTANT_MESSAGES : receives

    USERS {
        UUID id PK "Identificador único"
        TEXT name "Nome completo do usuário"
        TEXT email "Email de login"
        TEXT password_hash "Senha criptografada"
        TEXT avatar_url "URL da imagem de perfil"
        TEXT role "Papel do usuário (student, admin, etc)"
        BOOLEAN is_email_verified "Se o email foi verificado"
        TEXT email_verification_token "Token de verificação de email"
        TIMESTAMP email_verification_sent_at "Data do envio do token"
        TEXT password_reset_token "Token de redefinição de senha"
        TIMESTAMP password_reset_expires_at "Validade do token de senha"
        INTEGER login_attempts "Tentativas de login inválidas"
        TIMESTAMP locked_until "Conta bloqueada até"
        BOOLEAN two_factor_enabled "Se 2FA está habilitado"
        TEXT two_factor_secret "Segredo do 2FA (TOTP)"
        TEXT session_token "Token de sessão persistente"
        TEXT timezone "Fuso horário preferido"
        TEXT language "Idioma preferido"
        DATE birth_date "Data de nascimento"
        BOOLEAN notifications_enabled "Se deseja notificações"
        TEXT auth_provider "Provedor de autenticação (email, google...)"
        TIMESTAMP created_at "Data de criação da conta"
        TIMESTAMP updated_at "Última atualização do usuário"
        TIMESTAMP deleted_at "Deleção lógica (soft delete)"
        TIMESTAMP last_login_at "Data do último login"
    }

    PLANS {
        UUID id PK "Identificador único do plano"
        UUID user_id FK "Referência ao dono do plano"
        UUID objective_id FK "Objetivo do plano (OAB, concurso...)"
        UUID plan_status_id FK "Status atual do plano"
        TEXT name "Nome do plano de estudo"
        TEXT image_url "Imagem de capa do plano"
        TEXT notes "Notas ou observações do usuário"
        DATE start_date "Data de início (opcional)"
        DATE end_date "Data de término (opcional)"
        INTEGER weekly_hours "Horas disponíveis por semana"
        BOOLEAN review_enabled "Revisão espaçada está habilitada?"
        INTEGER[] review_intervals "Intervalos de revisão (1,7,15...)"
        TIMESTAMP created_at "Data de criação do plano"
        TIMESTAMP updated_at "Última atualização"
        TIMESTAMP deleted_at "Deleção lógica (soft delete)"
    }

    PLAN_TEMPLATES {
        UUID id PK "Identificador único do template"
        UUID created_by FK "Usuário criador (admin, moderador...)"
        UUID objective_id FK "Objetivo do plano"
        UUID plan_status_id FK "Status do template (ex: published, draft)"
        TEXT name "Nome do plano modelo"
        TEXT description "Descrição opcional"
        TEXT image_url "Imagem ilustrativa"
        INTEGER weekly_hours "Carga horária semanal sugerida"
        BOOLEAN review_enabled "Se recomenda revisão espaçada"
        INTEGER[] review_intervals "Intervalos de revisão sugeridos"
        TIMESTAMP created_at "Data de criação"
        TIMESTAMP updated_at "Última atualização"
        TIMESTAMP deleted_at "Soft delete"
    }

    OBJECTIVES {
        UUID id PK "Identificador único"
        TEXT name "Nome do objetivo (ex: ENEM)"
        TEXT description "Descrição opcional do objetivo"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
        TIMESTAMP deleted_at "Soft delete"
    }

    PLAN_STATUSES {
        UUID id PK "Identificador único"
        TEXT name "Nome do status (active, paused, finished)"
        TEXT description "Descrição do status"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
        TIMESTAMP deleted_at "Soft delete"
    }

    EXAMS {
        UUID id PK "Identificador único"
        TEXT name "Nome do edital (ex: Técnico Bancário 2025)"
        TEXT institution "Instituição responsável pelo edital"
        INTEGER year "Ano da prova (opcional)"
        TEXT description "Descrição opcional do edital"
        BOOLEAN is_active "Se está visível/ativo na plataforma"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
        TIMESTAMP deleted_at "Soft delete"
    }

    PLAN_EXAMS {
        UUID plan_id FK "Plano associado"
        UUID exam_id FK "Edital associado"
        TIMESTAMP created_at "Data da associação"
    }

    PLAN_TEMPLATE_EXAMS {
        UUID plan_template_id FK "Template associado"
        UUID exam_id FK "Edital associado"
        TIMESTAMP created_at "Data da associação"
    }

    ROLES {
        UUID id PK "Identificador único"
        TEXT name "Nome do cargo"
        TEXT description "Descrição opcional do cargo"
        BOOLEAN is_active "Se o cargo está ativo no sistema"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
        TIMESTAMP deleted_at "Soft delete"
    }

    PLAN_ROLES {
        UUID plan_id FK "Plano associado"
        UUID role_id FK "Cargo associado"
        TIMESTAMP created_at "Data da associação"
    }

    PLAN_TEMPLATE_ROLES {
        UUID plan_template_id FK "Template associado"
        UUID role_id FK "Cargo associado"
        TIMESTAMP created_at "Data da associação"
    }

    DISCIPLINES {
        UUID id PK "Identificador único"
        TEXT name "Nome da disciplina"
        TEXT description "Descrição opcional da disciplina"
        BOOLEAN is_active "Se está ativa no sistema"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
        TIMESTAMP deleted_at "Soft delete"
    }

    PLAN_DISCIPLINES {
        UUID plan_id FK "Plano associado"
        UUID discipline_id FK "Disciplina associada"
        INTEGER percentage "Porcentagem da carga horária (opcional)"
        INTEGER weekly_hours "Horas semanais (opcional)"
        TEXT color "Cor para representar a disciplina"
        TIMESTAMP created_at "Data da associação"
    }

    PLAN_TEMPLATE_DISCIPLINES {
        UUID plan_template_id FK "Template associado"
        UUID discipline_id FK "Disciplina associada"
        UUID discipline_template_id FK "Disciplina modelo associada"
        INTEGER percentage "Porcentagem sugerida"
        INTEGER weekly_hours "Horas semanais sugeridas"
        TEXT color "Cor sugerida"
        TIMESTAMP created_at "Data da associação"
    }

    TOPICS {
        UUID id PK "Identificador único"
        UUID discipline_id FK "Disciplina associada"
        TEXT name "Nome do tópico"
        TEXT description "Descrição do tópico"
        BOOLEAN is_active "Se o tópico está ativo"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
        TIMESTAMP deleted_at "Soft delete"
    }

    PLAN_TOPICS {
        UUID plan_id FK "Plano associado"
        UUID topic_id FK "Tópico associado"
        BOOLEAN completed "Se o tópico foi concluído"
        TIMESTAMP created_at "Data da associação"
        TIMESTAMP updated_at "Última atualização"
    }

    DISCIPLINE_TEMPLATES {
        UUID id PK "Identificador único"
        UUID created_by FK "Criado por (usuário ou admin)"
        TEXT name "Nome da disciplina modelo"
        TEXT description "Descrição da disciplina modelo"
        TEXT color "Cor sugerida"
        BOOLEAN is_active "Se está ativa"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
        TIMESTAMP deleted_at "Soft delete"
    }

    TOPIC_TEMPLATES {
        UUID id PK "Identificador único"
        UUID discipline_template_id FK "Disciplina modelo associada"
        TEXT name "Nome do tópico modelo"
        TEXT description "Descrição do tópico"
        BOOLEAN is_active "Se está ativo"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
        TIMESTAMP deleted_at "Soft delete"
    }

    STUDY_CATEGORIES {
        UUID id PK "Identificador único"
        TEXT name "Nome da categoria (teoria, revisão, questões)"
        TEXT description "Descrição opcional"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
        TIMESTAMP deleted_at "Soft delete"
    }

    STUDY_RECORDS {
        UUID id PK "Identificador único"
        UUID plan_topic_id FK "Referência ao plano + tópico"
        UUID study_category_id FK "Categoria do estudo"
        TIME study_time "Tempo de estudo (hh:mm:ss)"
        TEXT material "Material utilizado"
        BOOLEAN completed "Se o tópico foi concluído neste estudo"
        BOOLEAN schedule_reviews "Deseja agendar revisões?"
        INTEGER questions_right "Questões certas (opcional)"
        INTEGER questions_wrong "Questões erradas (opcional)"
        INTEGER start_page "Página inicial (opcional)"
        INTEGER end_page "Página final (opcional)"
        TEXT video_name "Nome da videoaula (opcional)"
        TIME video_start_time "Timestamp inicial do vídeo"
        TIME video_end_time "Timestamp final do vídeo"
        TEXT comment "Comentário livre sobre o estudo"
        DATE studied_at "Data do estudo"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
    }

    SCHEDULED_REVIEWS {
        UUID id PK "Identificador único"
        UUID plan_id FK "Plano de estudo associado UNIQUE(plan_id, topic_id, scheduled_date)"
        UUID topic_id FK "Tópico associado UNIQUE(plan_id, topic_id, scheduled_date)"
        DATE scheduled_date "Data planejada para revisão UNIQUE(plan_id, topic_id, scheduled_date)"
        BOOLEAN completed "Se a revisão foi feita"
        BOOLEAN ignored "Se a revisão foi ignorada"
        TIMESTAMP completed_at "Data e hora da conclusão da revisão"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
    }

    PLAN_TOPIC_LINKS {
        UUID id PK "Identificador único do link"
        UUID plan_id FK "Plano associado"
        UUID topic_id FK "Tópico associado"
        TEXT title "Título do link"
        TEXT url "Endereço do link"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
    }

    STUDY_CYCLES {
        UUID id PK "Identificador único do ciclo"
        UUID user_id FK "Usuário dono do ciclo"
        TEXT name "Nome do ciclo de estudos"
        TEXT description "Descrição opcional"
        BOOLEAN is_active "Se está em uso atualmente"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
        TIMESTAMP deleted_at "Soft delete"
    }

    STUDY_CYCLE_DISCIPLINES {
        UUID id PK "Identificador único"
        UUID study_cycle_id FK "Ciclo de estudo associado"
        UUID discipline_id FK "Disciplina associada"
        INTEGER target_minutes "Minutos alvo para essa disciplina"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
    }

    SIMULATED_EXAMS {
        UUID id PK "Identificador único"
        UUID plan_id FK "Plano associado ao simulado"
        UUID exam_style_id FK "Estilo da prova (múltipla escolha ou certo/errado)"
        TEXT name "Nome do simulado"
        TEXT board "Banca do simulado"
        TIME time_spent "Tempo total gasto no simulado"
        DATE simulated_at "Data em que o simulado foi realizado"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
    }

    EXAM_STYLES {
        UUID id PK "Identificador único"
        TEXT name "Nome do estilo (Múltipla Escolha, Certo/Errado)"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
    }

    SIMULATED_EXAM_DISCIPLINES {
        UUID id PK "Identificador único"
        UUID simulated_exam_id FK "Simulado associado"
        UUID discipline_id FK "Disciplina associada"
        INTEGER weight "Peso da disciplina no simulado"
        INTEGER total_questions "Total de questões"
        INTEGER correct_answers "Quantidade de acertos"
        INTEGER wrong_answers "Quantidade de erros"
        INTEGER blank_answers "Deixadas em branco (apenas para Certo/Errado)"
        TEXT comment "Comentário sobre a disciplina no simulado"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
    }

    RESOURCE_TYPES {
        UUID id PK "Identificador único"
        TEXT name "Nome do tipo de recurso (ex: resumo, imagem, PDF, link)"
        TEXT description "Descrição opcional do tipo"
        TEXT icon "Nome do ícone ou caminho"
        TEXT color "Cor associada ao tipo (ex: #FFD700)"
        BOOLEAN is_active "Se o tipo está ativo para uso"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
        TIMESTAMP deleted_at "Soft delete"
    }

    PLAN_TOPIC_RESOURCES {
        UUID id PK "Identificador único"
        UUID plan_id FK "Plano de estudo associado"
        UUID topic_id FK "Tópico associado"
        UUID resource_type_id FK "Tipo do recurso"
        TEXT title "Título do recurso"
        TEXT description "Descrição opcional"
        TEXT url "URL ou caminho do arquivo (PDF, imagem, vídeo, etc)"
        TEXT content "Conteúdo textual (usado por resumos, flashcards, etc)"
        INTEGER order "Ordem de exibição"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
        TIMESTAMP deleted_at "Soft delete"
    }

    PLAN_TOPIC_REVIEWS {
        UUID id PK "Identificador único"
        UUID plan_id FK "Plano associado"
        UUID topic_id FK "Tópico associado"
        DATE last_reviewed_at "Data da última revisão"
        DATE next_review_at "Data da próxima revisão"
        INTEGER repetitions "Repetições corretas consecutivas"
        FLOAT easiness_factor "Fator de facilidade"
        INTEGER interval "Intervalo (em dias)"
        TIMESTAMP created_at "Criado em"
        TIMESTAMP updated_at "Atualizado em"
        TIMESTAMP deleted_at "Soft delete"
    }

    STUDY_GOALS {
        UUID id PK
        UUID user_id FK
        UUID plan_id FK
        UUID goal_type_id FK
        UUID period_id FK
        INTEGER target
        TIMESTAMP start_date
        TIMESTAMP end_date
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
    }

    STUDY_GOAL_TYPES {
        UUID id PK
        TEXT name "Ex: tempo, tópicos, revisões"
        TEXT description
        TIMESTAMP created_at
    }

    STUDY_PERIODS {
        UUID id PK
        TEXT name "Ex: diário, semanal, mensal"
        TEXT description
        TIMESTAMP created_at
    }

    STUDY_NOTES {
        UUID id PK
        UUID user_id FK
        DATE date
        TEXT note
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    STUDY_MOOD_TRACKING {
        UUID id PK
        UUID user_id FK
        UUID study_record_id FK
        UUID mood_id FK
        UUID energy_level_id FK
        TEXT notes
        TIMESTAMP created_at
    }

    MOOD_TYPES {
        UUID id PK
        TEXT name "Ex: motivado, cansado, animado"
        TEXT emoji
        TIMESTAMP created_at
    }

    ENERGY_LEVELS {
        UUID id PK
        INTEGER value "0 a 10"
        TEXT description
        TIMESTAMP created_at
    }

    ACHIEVEMENTS {
        UUID id PK
        TEXT name "Ex: 7 dias seguidos"
        TEXT description
        TEXT icon
        TIMESTAMP created_at
    }

    USER_ACHIEVEMENTS {
        UUID id PK
        UUID user_id FK
        UUID achievement_id FK
        TIMESTAMP achieved_at
    }

    PROGRESS_LOGS {
        UUID id PK
        UUID user_id FK
        UUID plan_id FK
        DATE date
        INTEGER total_minutes
        INTEGER topics_completed
        INTEGER reviews_completed
        INTEGER questions_correct
        INTEGER questions_wrong
        TIMESTAMP created_at
    }

    PLAN_PROJECTIONS {
        UUID id PK
        UUID user_id FK
        UUID plan_id FK
        DATE projected_completion
        FLOAT confidence
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    TOPIC_RELATIONS {
        UUID id PK
        UUID topic_id FK
        UUID related_topic_id FK
        UUID relation_type_id FK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    TOPIC_RELATION_TYPES {
        UUID id PK
        TEXT name "Ex: prerequisite, complementary"
        TEXT description
        TIMESTAMP created_at
    }

    FLASHCARDS {
        UUID id PK
        UUID user_id FK
        UUID plan_topic_id FK
        TEXT front
        TEXT back
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
    }

    FLASHCARD_REVIEWS {
        UUID id PK
        UUID flashcard_id FK
        DATE reviewed_at
        INTEGER ease "0-5"
        INTEGER interval "em dias"
        FLOAT easiness_factor
        INTEGER repetitions
        DATE next_review_at
        TIMESTAMP created_at
    }

    DATA_EXPORTS {
        UUID id PK
        UUID user_id FK
        TIMESTAMP requested_at
        TEXT status
        TEXT download_url
        TEXT format
        TIMESTAMP deleted_at
    }

    DATA_IMPORTS {
        UUID id PK
        UUID user_id FK
        TIMESTAMP imported_at
        TEXT status
        TEXT source_platform
        TEXT summary
        TIMESTAMP deleted_at
    }

    NOTIFICATIONS {
        UUID id PK
        UUID user_id FK
        UUID notification_type_id FK
        TEXT title
        TEXT message
        BOOLEAN read
        TIMESTAMP scheduled_at
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    NOTIFICATION_TYPES {
        UUID id PK
        TEXT name
        TEXT description
        TEXT icon
        TIMESTAMP created_at
    }

    TAGS {
        UUID id PK
        UUID user_id FK
        TEXT name
        TEXT color
        TIMESTAMP created_at
    }

    PLAN_TOPIC_TAGS {
        UUID id PK
        UUID plan_topic_id FK
        UUID tag_id FK
        TIMESTAMP created_at
    }

    STUDY_GROUPS {
        UUID id PK
        TEXT name
        TEXT description
        UUID admin_user_id FK
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP deleted_at
    }

    STUDY_GROUP_MEMBERS {
        UUID id PK
        UUID group_id FK
        UUID user_id FK
        TEXT role "admin | member"
        TIMESTAMP joined_at
        TIMESTAMP deleted_at
    }

    RESOURCE_FEEDBACKS {
        UUID id PK
        UUID user_id FK
        UUID plan_topic_resource_id FK
        INTEGER rating
        TEXT comment
        TIMESTAMP created_at
        TIMESTAMP deleted_at
    }

    STUDY_CALENDAR_EVENTS {
        UUID id PK
        UUID user_id FK
        TEXT type "study | review | simulado"
        UUID related_id FK
        TEXT title
        TIMESTAMP start_time
        TIMESTAMP end_time
        TEXT color
        TIMESTAMP created_at
        TIMESTAMP deleted_at
    }

    ANALYSIS_SNAPSHOTS {
        UUID id PK
        UUID user_id FK
        DATE period_start
        DATE period_end
        JSON summary_json
        TIMESTAMP created_at
        TIMESTAMP deleted_at
    }

    FAVORITE_RESOURCES {
        UUID id PK
        UUID user_id FK
        UUID plan_topic_resource_id FK
        TIMESTAMP favorited_at
        TIMESTAMP deleted_at
    }

    STUDY_ASSISTANT_MESSAGES {
        UUID id PK
        UUID user_id FK
        TEXT trigger_type
        TEXT message
        TEXT action_url
        TIMESTAMP created_at
    }
```
