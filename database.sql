CREATE TABLE `crew_users` (
  `user_id` varchar(20) COLLATE utf8_polish_ci NOT NULL,
  `exp` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `last_msg` int(11) NOT NULL,
  `msgs_today` int(11) NOT NULL,
  `msgs_total` int(11) NOT NULL,
  `win_days` int(11) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

CREATE TABLE `public_users` (
  `user_id` varchar(20) COLLATE utf8_polish_ci NOT NULL,
  `exp` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `last_msg` int(11) NOT NULL,
  `msgs_today` int(11) NOT NULL,
  `msgs_total` int(11) NOT NULL,
  `win_days` int(11) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

CREATE TABLE `punishments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(20) COLLATE utf8_polish_ci NOT NULL,
  `admin_id` varchar(20) COLLATE utf8_polish_ci NOT NULL,
  `action` tinytext COLLATE utf8_polish_ci NOT NULL,
  `duration` int(11) NOT NULL,
  `reason` text COLLATE utf8_polish_ci NOT NULL,
  `time` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(20) COLLATE utf8_polish_ci NOT NULL,
  `start_timestamp` int(11) NOT NULL,
  `end_timestamp` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `perm_lvl` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;