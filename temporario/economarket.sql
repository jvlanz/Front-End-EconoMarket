-- banco de dados incompleto, apenas com o necessário para começar o desenvolvimento do código java/jsp

create database db_economarket;
use db_economarket;


create table tb_categorias (
    id int primary key auto_increment,
    categoria varchar(128) not null
);


create table tb_produtos (
    id int primary key auto_increment,
    descricao varchar(128) not null,
    medida varchar(16),
    id_categoria int not null,

    constraint fk_categoria 
        foreign key (id_categoria) references tb_categorias(id)
);


create table tb_mercados (
    id int primary key auto_increment,
    nome varchar(256) not null,
    rua varchar(256) not null,
    numero int not null,
    cidade varchar(128) not null,
    CEP varchar(9) not null
);


create table tb_precos (
    id int primary key auto_increment,
    preco decimal(10,2) not null,
    id_produto int not null,
    id_mercado int not null,

    constraint fk_produto 
        foreign key (id_produto) references tb_produtos(id),

    constraint fk_mercado 
        foreign key (id_mercado) references tb_mercados(id)
);


create table tb_cadastros (
    id int primary key auto_increment,
    nome varchar(256) not null,
    senha varchar(256) not null,
    telefone varchar(16) not null,
    email varchar(256) not null
);


create table tb_favoritos (
    id int primary key auto_increment,
    id_produto int not null,
    id_cadastros int not null,

    constraint fk_fav_produto 
        foreign key (id_produto) references tb_produtos(id),

    constraint fk_cadastros 
        foreign key (id_cadastros) references tb_cadastros(id),

    constraint uk_favorito 
        unique (id_produto, id_cadastros)
);


-- CATEGORIAS

insert into tb_categorias (categoria) values ('Hortifruti');
insert into tb_categorias (categoria) values ('Açougue');
insert into tb_categorias (categoria) values ('Frios e Laticínios');
insert into tb_categorias (categoria) values ('Congelados');
insert into tb_categorias (categoria) values ('Mercearia');
insert into tb_categorias (categoria) values ('Limpeza');
insert into tb_categorias (categoria) values ('Higiene e Beleza');
insert into tb_categorias (categoria) values ('Bebidas');
insert into tb_categorias (categoria) values ('Utilidades');
insert into tb_categorias (categoria) values ('Padaria');
insert into tb_categorias (categoria) values ('Pets');


-- PRODUTOS

insert into tb_produtos (id_categoria, descricao)
values (1, 'Bananas');

insert into tb_produtos (id_categoria, descricao)
values (2, 'Coxão Mole');

insert into tb_produtos (id_categoria, descricao)
values (1, 'Ovos Vermelhos');

insert into tb_produtos (id_categoria, descricao)
values (1, 'Banana Caturra');

insert into tb_produtos (id_categoria, descricao)
values (1, 'Banana Prata');

insert into tb_produtos (id_categoria, descricao)
values (3, 'Queijo Fatiado');