import passport from 'passport';
import db from './db';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { User } from '../models/User';
import { env } from './env';

const configPassport = (passport: passport.PassportStatic) => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const id = jwt_payload.id;
        const queryResult = await db.query<User>(
          'SELECT * FROM users WHERE id = $1',
          [id],
        );

        const user: User = queryResult.rows[0];

        if (!user)
          return done(null, false, { message: 'User does not exist.' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );
};

export default configPassport;
