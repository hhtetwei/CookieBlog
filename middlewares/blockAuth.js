const Users = require("./../models/userModel");

const isBlockedUser = async (req, res, next) => {
  try {
    const requestedBy = req.user.id;
    const { name } = req.query;

    const { blockedUsers } = await Users.findById(requestedBy).populate(
      "blockedUsers"
    );

    if (blockedUsers.length) {
      const blockedUser = blockedUsers.find((user) => user.name === name); //looping and finding the name that match with req query name

      if (blockedUser) {
        return res.status(404).json("This content is not available");
      }
    }

    return next(); //going to the controller

    // const users = await Users.find({ name });

    // const userIdArray = [];

    // for (let i = 0; i < users.length; i++) {
    //   const { _id } = users[i];
    //   userIdArray.push(_id);
    // }

    // const userId = req.user.id; //object

    // const { blockedUsers } = await Users.findById(userId);

    // console.log(blockedUsers);
    // console.log(userIdArray);

    // function compare(arr1, arr2) {
    //   let isMatch;
    //   arr1.forEach((e1) =>
    //     arr2.forEach((e2) => {
    //       isMatch = e1.toString() === e2.toString();
    //     })
    //   );
    //   return isMatch;
    // }

    // const isMatch = compare(blockedUsers, userIdArray);
    // console.log(isMatch);

    // if (isMatch) {
    //   return res.json("This content is not available");
    // }

    // const user = await Users.findById(userId).populate({
    //   path: "blockedUsers",
    //   select: "name",
    // });

    // const { name } = req.query;
    // const requestedUser = await Users.findById(req.params.id);

    // const { blockedUsers } = user;

    // console.log({ blockedUsers });

    // if (blockedUsers.include(name)) {
    //   return res.status(404).json({
    //     status: false,
    //     Message: "This content is not available!",
    //   });
    // }
  } catch (err) {
    next(err);
  }
};

module.exports = isBlockedUser;
