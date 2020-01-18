alter table events
    add location varchar(255);

insert into deploy (version, comment) values (2, 'Add location to events');