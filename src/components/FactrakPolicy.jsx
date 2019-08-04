// React imports
import React from "react";

const FactrakPolicy = () => {
  return (
    <div className="article">
      <section>
        <article>
          <h3>Policy</h3>
          <br />

          <h4>IMPORTANT &mdash; new in 2016:</h4>
          <p>
            <strong>
              Factrak is only helpful if we have a lot of recent reviews from
              lots of different people, so we&apos;ve introduced a few changes.
            </strong>
          </p>
          <p>
            In order to access Factrak,{" "}
            <strong>
              you must contribute at least 2 reviews per semester.{" "}
            </strong>
            This requirement is waived if you have reviewed at least all but 2
            of your courses in your time at Williams. The requirement is not
            retroactive. The year is divided into 2 periods: March - September,
            and October - February. To view Factrak during one of these two
            periods, the above requirements must have been met during that
            period. For example, to see Factrak in December, you must have
            submitted at least 2 reviews since October.
          </p>
          <p>
            Factrak now supports bubble-sheet style reviews for courses and
            professors. This is entirely optional, and you can still submit just
            the traditional text comment. The statistics gathered will not be
            visible until enough data is collected.
          </p>

          <br />
          <br />

          <p>
            To create a forum where students can openly and honestly share their
            opinions of their professors in a manner that is anonymous and only
            visible to other students. This feedback is primarily designed to
            help other students find courses and professors which are the best
            matches for them.
          </p>

          <p>
            While Factrak is designed to be as open as possible, inappropriate
            comments will not be tolerated, and comments can be removed or
            edited at the discretion of the student moderator to bring them into
            accordance with this policy. Inappropriate comments include, but are
            not limited to, comments that name other students, that contain
            racial or ethnic slurs, and those that harass others. Users may flag
            comments for moderator review using the button at the bottom of each
            comment. Use this if you feel the comment has violated the
            acceptable use policy.
          </p>

          <p>
            By using Factrak users agree to abide by this policy. The use of
            Factrak is also governed by the
            <a href="http://wso.williams.edu/about#policy">
              wider WSO policy
            </a>{" "}
            and the{" "}
            <a href="http://oit.williams.edu/w/?u=docs/Computing+Ethics+and+Responsibilities">
              OIT Computing Ethics and Responsibilities Statement
            </a>
            .
          </p>

          {/* {currentUser.factrak_policy ? (
            <p>You have already accepted the Factrak policy.</p>
          ) : (
            <form
              action="/factrak/accept_policy"
              acceptCharset="UTF-8"
              method="post"
            >
              <input name="utf8" type="hidden" value="✓" />
              <input
                type="hidden"
                name="authenticity_token"
                value={authToken}
              />
              <p>
                <input type="checkbox" name="accept" id="accept" value="1" />I
                agree to the Factrak policy.
              </p>
              <input
                type="submit"
                name="commit"
                value="continue"
                data-disable-with="continue"
              />
            </form>
          )} */}
          <br />
          <br />
        </article>
      </section>
    </div>
  );
};

export default FactrakPolicy;
