CREATE TABLE user (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  user_role ENUM('admin', 'coach', 'client') NOT NULL DEFAULT 'coach',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE coach_plans (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  plan_name VARCHAR(255) NOT NULL,
  plan_description TEXT NOT NULL,
  price_per_month DECIMAL(10, 2) NOT NULL,
  price_per_year DECIMAL(10, 2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE coaches (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  plan_id INT UNSIGNED NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NULL,
  profile_picture VARCHAR(255) NULL,
  speciality VARCHAR(255) NULL,
  bio TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES coach_plans(id)
);

CREATE TABLE clients (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  coach_id INT UNSIGNED NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone INT UNSIGNED NULL,
  gender ENUM('male', 'female') NOT NULL,
  birth_date DATE NOT NULL,
  weight_kg INT NOT NULL,
  height_cm INT NOT NULL,
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (coach_id) REFERENCES coaches(id)
);

CREATE TABLE courses (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  coach_id INT UNSIGNED NOT NULL,
  current_status ENUM('draft', 'published', 'full', 'finished', 'cancelled') NOT NULL DEFAULT 'draft',
  title VARCHAR(255) NOT NULL,
  description_notes TEXT NOT NULL,
  price DECIMAL(10, 2) NULL,
  is_free BOOLEAN NOT NULL DEFAULT TRUE,
  start_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location_link TEXT NOT NULL,
  max_participants INT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE CASCADE
);

CREATE TABLE course_participants (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  course_id INT UNSIGNED NOT NULL,
  client_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE plan_features (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  plan_id INT UNSIGNED NOT NULL,
  feature_name VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES coach_plans(id)
);

CREATE TABLE plan_subscriptions (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  plan_id INT UNSIGNED NOT NULL,
  coach_id INT UNSIGNED NOT NULL,
  subscription_start_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  subscription_end_date DATE NOT NULL,
  subscription_status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  type_of_subscription ENUM('monthly', 'yearly') NOT NULL DEFAULT 'monthly',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES coach_plans(id),
  FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE CASCADE
);

CREATE TABLE workouts (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  coach_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  workout_description TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  level_of_difficulty ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE CASCADE
);

CREATE TABLE exercises (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  coach_id INT UNSIGNED NOT NULL,
  exercise_name VARCHAR(255) NOT NULL,
  notes TEXT NOT NULL,
  level_of_difficulty ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
  primary_muscle_group VARCHAR(255) NOT NULL,
  secondary_muscle_group VARCHAR(255) NOT NULL,
  media_url VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE CASCADE
);

CREATE TABLE workout_exercises (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  workout_id INT UNSIGNED NOT NULL,
  exercise_id INT UNSIGNED NOT NULL,
  sets_count INT NOT NULL DEFAULT 1,
  reps_count INT NOT NULL DEFAULT 1,
  weight_kg INT NOT NULL DEFAULT 0,
  rest_time_seconds INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE TABLE assigned_workouts (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  client_id INT UNSIGNED NOT NULL,
  workout_id INT UNSIGNED NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

INSERT INTO user(id, email, user_role, password)
VALUES
  (1, "dev@hatchimike.com", "admin", "123456");

INSERT INTO coach_plans(id, plan_name, plan_description, price_per_month, price_per_year)
VALUES
  (1, "Découverte", "Coachs débutants qui souhaitent tester la plateforme sans engagement.", 0, 0),
  (2, "Essentiel", "Coachs avec une clientèle modérée.", 39, 398),
  (3, "Premium", "Coachs expérimentés recherchant des outils avancés.", 69, 704),
  (4, "Custom", "Grandes entreprises ou coachs professionnels avec des besoins avancés.", 99, 1010);

INSERT INTO plan_features(id, plan_id, feature_name)
VALUES
  (1, 1, "Gestion de 5 clients maximum"),
  (2, 1, "Création de séances (10 maximum)"),
  (3, 1, "Accès limité au calendrier "),
  (4, 1, "Branding imposé"),
  (5, 1, "Support via FAQ uniquement"),
  (6, 1, "1 plan nutritionnel"),
  (7, 1, "Visualisation des statistiques basiques"),
  (8, 1, "25 exercices"),
  (9, 2, "Gestion jusqu'à 50 clients"),
  (10, 2, "Création de séances illimitées"),
  (11, 2, "Accès au calendrier"),
  (12, 2, "Branding imposé"),
  (13, 2, "Support via FAQ et email"),
  (14, 2, "Accès au plan nutritionnel"),
  (15, 2, "150 exercices"),
  (16, 2, "3 collaborateurs"),
  (17, 3, "Gestion jusqu'à 100 clients"),
  (18, 3, "Création de séances illimitées"),
  (19, 3, "Calendrier avancé (intégration avec Google Calendar)"),
  (20, 3, "Branding minimaliste"),
  (22, 3, "Création et Gestion des abonnements clients"),
  (23, 3, "Création et gestion des factures"),
  (24, 3, "Support via email et chat"),
  (25, 3, "Création de programmes avancés"),
  (26, 4, "Gestion illimitée de clients"),
  (27, 4, "Création de séances illimitées"),
  (28, 4, "Statistiques avancées avec export des données"),
  (29, 4, "Gestion d'équipes (sous-comptes)"),
  (30, 4, "Création et Gestion des abonnements clients"),
  (31, 4, "Création et gestion des factures et devis"),
  (32, 4, "Intégration API externes"),
  (33, 4, "Support VIP (assistances téléphoniques)");
