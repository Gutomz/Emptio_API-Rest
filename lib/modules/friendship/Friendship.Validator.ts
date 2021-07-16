import { DuplicatedDocumentError } from '../../errors/DuplicatedModel.Error';
import { InvalidFieldError } from '../../errors/Field.Error';
import { FriendshipNotFoundError } from '../../errors/NotFound.Error';
import { FRIENDSHIP_STATUS } from '../../utils/enums';
import CommomValidator from '../common/Common.Validator';
import UserService from '../user/User.Service';
import FriendshipService from './Friendship.Service';

class UserValidator {
  async validate_request({ friendId, user }): Promise<boolean> {
    CommomValidator.validate_field(friendId, 'friendId');

    await UserService.findById(friendId);

    if (friendId == user.id) {
      throw new InvalidFieldError('friendId');
    }

    if (await FriendshipService.exist({ friend: friendId, owner: user.id })) {
      throw new DuplicatedDocumentError('Friendship');
    }

    return true;
  }

  async validate_update_request(body, params): Promise<boolean> {
    const { user, accept } = body;
    const { id } = params;

    CommomValidator.validate_field(accept, 'accept');

    const friendship = await FriendshipService.findOne({
      _id: id,
      status: FRIENDSHIP_STATUS.PENDING,
      friend: user.id,
    });

    if (!friendship) {
      throw new FriendshipNotFoundError();
    }

    return true;
  }
}

export default new UserValidator();
