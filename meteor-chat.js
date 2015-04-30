Router.route("/", function(){
  this.layout("appLayout");
  this.render("home");
});

Router.route("/chat", function(){
  this.layout("appLayout");
  this.render("chat");
});

Messages = new Mongo.Collection("messages");

if (Meteor.isClient) {
  Meteor.subscribe("messages");

  Template.chat.helpers({
    messages: function(){
      return Messages.find();
    }
  });

  Template.chat.events({
    'submit form': function(event){
      var text = event.target.text.value;

      Messages.insert({
        text: text,
        owner: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().profile.name
      })

      event.target.text.value = "";
      return false;
    }
  })

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
   Meteor.publish("messages", function(){
    return Messages.find();
  })

   Messages.allow({
    'insert': function(){
      return true;
    }
   })
}
