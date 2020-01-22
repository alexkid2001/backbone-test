const pattern= {
    name: /^[a-zA-Zа-яА-ЯёЁ]{2,30}$/,
    phone: /^[\+]?[\d]{2,3}[\d\-]{5,14}$/
};

const initUsers = [
    {name: 'Mikhail', phone: '+1234567'},
    {name: 'John', phone: '8123-45-67'},
    {name: 'Александр', phone: '+381234567'},
    {name: 'Анна', phone: '+10-381-234-567'}
]

var User = Backbone.Model.extend({
    defaults: {
        name: '',
        phone: ''
    }
});

var Users = Backbone.Collection.extend({

//for API
//    url: '/api/user'
});

var users = new Users(initUsers);

var UserView = Backbone.View.extend({
    model: new User(),
    tagName: 'tr',
    initialize: function(){
        this.template = _.template($('.users-list-template').html());
    },
    events:  {
        'click .edit-btn': 'edit',
        'click .update-btn': 'update',
        'click .cancel-btn': 'cancel',
        'click .delete-btn': 'delete'
    },
    edit: function() {
        // console.log(this.$el.querySelector('.update-btn'));
        $('.edit-btn').hide();
        $('.delete-btn').hide();
        this.$('.update-btn').show();
        this.$('.cancel-btn').show();

        this.$('.input-wrap').removeClass('hide');
        this.$('.name').addClass('hide');
        this.$('.phone').addClass('hide');
    },
    update: function() {
        let nameUpdate = this.$('.name-update');
        let phoneUpdate = this.$('.phone-update');
        let enableUpdate = true;

        if(!pattern.name.test(nameUpdate.val())) {
            nameUpdate.addClass('is-invalid');
            enableUpdate &= false;
        } else {
            nameUpdate.removeClass('is-invalid');
        }

        if(!pattern.phone.test(phoneUpdate.val())) {
            phoneUpdate.addClass('is-invalid');
            enableUpdate &= false;
        } else {
            phoneUpdate.removeClass('is-invalid');
        }

        if(enableUpdate) {
            this.model.set('name', nameUpdate.val());
            this.model.set('phone', phoneUpdate.val());
        }
//for API
//         this.model.save({}, {
//             success: function() {},
//             error: function() {}
//         })

    },
    cancel: function() {
        usersView.render();
    },
    delete: function() {
        this.model.destroy({
//for API
            // success: function () {
            // },
            // error: function () {
            // }
        });
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
})

var UsersView = Backbone.View.extend({
    model: users,
    el: $('.users-list'),
    initialize: function() {
        var self = this;
        this.model.on('add', this.render, this);
        this.model.on('change', () => {
            setTimeout(() => {
                self.render();
            }, 30);
        }, this);
        this.model.on('remove', this.render, this);
        this.render();

//for API
//       this.model.fetch({
//           success: function(response) {
//               _.each(response.toJSON(), function(item) {
//                 //Succesfully got
//               })
//           },
//           error: function() {
//               //Failed
//           }
//       });
    },
    render: function() {
        var self = this;
        this.$el.html('');
        _.each(this.model.toArray(), function(user){
            self.$el.append((new UserView({model: user})).render().$el);
        });
        return this;
    }
});

var usersView = new UsersView();

document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.querySelector('.add-user');
    const validateField = (field, pattern, flag) => {
        if(!pattern.test(field.value)) {
            field.classList.add('is-invalid');
            return false
        }
        return true
    };

    addBtn.addEventListener('click', () => {
        const nameInput = document.querySelector('.name-input');
        const phoneInput = document.querySelector('.phone-input');
        let enableAddUser = true;
        enableAddUser &= validateField(nameInput, pattern.name);
        enableAddUser &= validateField(phoneInput, pattern.phone);

        if( enableAddUser ) {
            console.log('Validate is success');
            let user = new User({
                name: nameInput.value,
                phone: phoneInput.value
            })

            nameInput.classList.remove('is-invalid');
            nameInput.value = '';
            phoneInput.classList.remove('is-invalid');
            phoneInput.value = '';
            enableAddUser = true;
            users.add(user);
//for API
//           user.save({}, {
//               success: function(response) {},
//               error: function(){}
//           });

        } else {
            console.log('Validate is error');
        }
    });
});
