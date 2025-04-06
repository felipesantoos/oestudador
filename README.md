erDiagram
    USERS ||--o{ PLANS : has
    OBJECTIVES ||--o{ PLANS : includes
    PLAN_STATUSES ||--o{ PLANS : defines

    USERS {
        UUID id PK "Identificador único"
        TEXT name "Nome completo"
        TEXT email "Email de login"
        TEXT password_hash "Hash da senha"
        TEXT avatar_url "Imagem de perfil"
        TEXT role "Papel do usuário (student, admin)"
        BOOLEAN is_email_verified "Email confirmado"
        TEXT email_verification_token "Token de verificação de email"
        TIMESTAMP email_verification_sent_at "Data do envio de verificação"
        TEXT password_reset_token "Token de recuperação de senha"
        TIMESTAMP password_reset_expires_at "Expiração do token de recuperação"
        INTEGER login_attempts "Tentativas de login"
        TIMESTAMP locked_until "Conta bloqueada até"
        BOOLEAN two_factor_enabled "2FA está habilitado"
        TEXT two_factor_secret "Segredo para TOTP (2FA)"
        TEXT session_token "Token de sessão (opcional)"
        TEXT timezone "Fuso horário preferido"
        TEXT language "Idioma preferido"
        DATE birth_date "Data de nascimento"
        BOOLEAN notifications_enabled "Deseja receber notificações"
        TEXT auth_provider "Tipo de login (email, google, etc)"
        TIMESTAMP created_at "Data de criação"
        TIMESTAMP updated_at "Última atualização"
        TIMESTAMP deleted_at "Soft delete"
        TIMESTAMP last_login_at "Último login"
    }

    PLANS {
        UUID id PK "Identificador único"
        UUID user_id FK "Referência ao usuário dono do plano"
        UUID objective_id FK "Referência ao objetivo do plano"
        UUID plan_status_id FK "Referência ao status do plano"
        TEXT name "Nome do plano"
        TEXT image_url "Imagem de capa do plano"
        TEXT notes "Observações do plano"
        DATE start_date "Data de início do plano (opcional)"
        DATE end_date "Data de término (opcional)"
        INTEGER weekly_hours "Horas disponíveis por semana"
        BOOLEAN review_enabled "Se revisões estão ativas"
        INTEGER[] review_intervals "Intervalos de revisão (1,7,15...)"
        TIMESTAMP created_at "Data de criação"
        TIMESTAMP updated_at "Última atualização"
        TIMESTAMP deleted_at "Deleção lógica (soft delete)"
    }

    OBJECTIVES {
        UUID id PK "Identificador único"
        TEXT name "Nome do objetivo"
        TEXT description "Descrição opcional"
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
