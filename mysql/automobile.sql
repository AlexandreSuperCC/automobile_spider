drop database mo_automobile;
create database mo_automobile;
use mo_automobile;

create table `t_systeme` (
    `id` int NOT NULL,
    `name` varchar(255) NOT NULL DEFAULT '',
    `dr` int DEFAULT 0,
    `ts` varchar(50),
    primary key(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table `t_piece` (
    `id` int NOT NULL,
    `name` varchar(255) NOT NULL DEFAULT '',
    `dr` int DEFAULT 0,
    `ts` varchar(50),
    `vdef1` int,-- the position in the current system
    `sid` int NOT NULL,-- t_systeme id
    primary key(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table `t_piece_detaillee` (
    `id` int NOT NULL,
    `name` varchar(255) NOT NULL DEFAULT '',
    `dr` int DEFAULT 0,
    `ts` varchar(50),
    `vdef1` varchar(255),-- original product list url
    `pid` int NOT NULL,-- t_piece id
    primary key(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table `t_produit` (
    `id` int NOT NULL,
    `name` varchar(255) NOT NULL DEFAULT '',
    `img_url` varchar(255),
    `price` varchar(50),
    `status` int,-- 0 en stock, 1 en rupture de stock
    `marque` varchar(255),
    `dr` int DEFAULT 0,
    `ts` varchar(50),
    `vdef1` varchar(255),-- original product url
    `pdid` int NOT NULL,-- t_piece_detaillee id
    primary key(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table `t_comment` (
    `id` int NOT NULL,
    `author_name` varchar(255),
    `content` text,
    `time` varchar(50),
    `purpose` text,
    `rate` varchar(10), 
    `dr` int DEFAULT 0,
    `ts` varchar(50),
    `pid` int NOT NULL,-- t_produit id
    primary key(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
