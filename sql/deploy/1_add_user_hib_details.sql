alter table users
    add why_join_hib text;

alter table users
    add yearly_days_pledged int;

create table if not exists deploy
(
    version varchar(6) not null
        constraint deploy_pk
            primary key,
    created_at timestamp not null default now(),
    comment text not null
);

insert into deploy (version, comment) values (1, 'Add User Hib details why_join_hib and yearly_days_pledged');