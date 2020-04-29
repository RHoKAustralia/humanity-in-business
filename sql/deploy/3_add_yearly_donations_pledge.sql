alter table users
    add yearly_donations_pledge int;

insert into deploy (version, comment) values (3, 'Add Yearly donation pledged');