pragma solidity ^0.4.2;

contract Portfolios {

    address public teacher;

    // ------------------------------------------------------------------------
    // Project management
    // ------------------------------------------------------------------------

    // Project definition
    struct Project {
        address creator;
        address[] members;   // maximum of 10 members per project

        bytes32 whitepaper;  // IPFS hash
        string title;
        // string summary;

        uint n_votes;        // amount of investment so far
    }

    // A dynamic list (implemented as a mapping) of projects
    mapping(uint => Project) public projects;
    uint public n_projects = 0;

    //TODO: this is redundant with Project::members
    struct Membership {
        uint i_project;
        bool assigned;
    }
    mapping(address => Membership) public memberships;

    // ------------------------------------------------------------------------
    // Voting
    // ------------------------------------------------------------------------

    struct voter {
        bool active;
        uint n_votes;
    }

    mapping(address => voter) voters;
    uint activeVoters = 1;

    struct votecast {
        uint i_project;
        uint n_votes;
    }

    mapping(address => votecast[]) investments;

    // ------------------------------------------------------------------------
    // Events
    // ------------------------------------------------------------------------

    event Voted(address voter, uint i_project, uint n_votes);

    // ------------------------------------------------------------------------
    // Constructor and a kill switch
    // ------------------------------------------------------------------------

    function Portfolios()
      public
    {
        teacher = msg.sender;
        voters[teacher].active = true;
        voters[teacher].n_votes = 35 ether;
    }

    function kill()
      public view
    {
        if (msg.sender != teacher)
            return;

    }

    // ------------------------------------------------------------------------
    // Private methods
    // ------------------------------------------------------------------------

    function updateInvestments(address who, uint i_project, uint n_votes)
      private
    {
        votecast[] storage portfolio = investments[who];

        bool alreadyVoted = false;
        for (uint i_vote = 0; i_vote < portfolio.length; i_vote++) {
            if (portfolio[i_vote].i_project == i_project) {
                alreadyVoted = true;
                portfolio[i_vote].n_votes += n_votes;
                break;
            }
        }
        if (!alreadyVoted) {
            uint voteLogLength = portfolio.length++;
            portfolio[voteLogLength].i_project = i_project;
            portfolio[voteLogLength].n_votes = n_votes;
        }
    }

    // ------------------------------------------------------------------------
    // Public methods for voting and grading
    // ------------------------------------------------------------------------

    function userActive(address who)
      public view
      returns (bool)
    {
      return voters[who].active;
    }

    function claimBenders(address who)
      public
    {
      if (!voters[who].active) {
          voters[who].active = true;
          voters[who].n_votes = 1 ether;
          activeVoters++;
      }
    }

    // Vote casting
    function vote(address who, uint i_project, uint n_votes)
      public
    {
        if (voters[who].n_votes < n_votes)
            return; // insufficient funds

        voters[who].n_votes  -= n_votes;
        projects[i_project].n_votes += n_votes;

        updateInvestments(who, i_project, n_votes);

        Voted(who, i_project, n_votes);
    }

    // How much capital does a voter have?
    function capital(address who)
      public view
      returns (uint _capital)
    {

        // 1. Capital not invested
        _capital = voters[who].n_votes / 2;

        int hp = homeProject(who);
        if (hp != -1) {

            // 2. Capital earned in own project
            Project storage myProject = projects[uint(hp)];
            _capital += myProject.n_votes / (2 * myProject.members.length);

            // 3. Capital invested in other projects
            votecast[] storage portfolio = investments[who];
            for (uint i_vote = 0; i_vote < portfolio.length; i_vote++) {
                Project storage p = projects[portfolio[i_vote].i_project];
                _capital += portfolio[i_vote].n_votes * p.n_votes / (p.members.length);
            }
        }
    }

    // What is the current grade? Grade is multiplied by 2 to avoid fixed point
    // arithmetics.
    function grade(address who)
      public view
      returns (uint8)
    {
        uint _capital = capital(who);
        uint8 _grade;
        if (_capital <= 0.5 ether)
            _grade = 6;
        else if(_capital <= 1.0 ether)
            _grade = 7;
        else if(_capital <= 1.25 ether)
            _grade = 8;
        else if(_capital <= 1.75 ether)
            _grade = 9;
        else
            _grade = 10;
        return _grade;
    }

    function votesLeft(address who)
      public view
      returns (uint)
    {
      return voters[who].n_votes;
    }

    // ------------------------------------------------------------------------
    // Public methods for project management
    // ------------------------------------------------------------------------

    // Creates a new project
    function newProject(address who, bytes32 whitepaper, string title)
      public
    {
        Project storage p = projects[n_projects];
        p.whitepaper = whitepaper;
        p.title = title;
        p.creator = who;
        n_projects++;
        joinProject(who, n_projects - 1);
    }

    // Joins a project
    function joinProject(address who, uint i_project)
      public
    {
        if (i_project >= n_projects)
            return;
        if (memberships[who].assigned) {  // already a member
            uint existingProject = memberships[who].i_project;
            uint8 i_member = 0;
            for (; i_member < projects[existingProject].members.length; i_member++) {
                if (projects[existingProject].members[i_member] == who)
                    break;
            }
            for (; i_member < projects[existingProject].members.length - 1; i_member++) {
                projects[existingProject].members[i_member] = projects[existingProject].members[i_member + 1];
            }
            projects[existingProject].members.length--;
        }
        memberships[who].i_project = i_project;
        memberships[who].assigned = true;

        projects[i_project].members.length++;
        projects[i_project].members[projects[i_project].members.length - 1] = who;
    }

    // What is my home project?
    function homeProject(address who)
      public view
      returns (int)
    {
        if (!memberships[who].assigned) {  // already a member
            return -1;
        } else {
            return int(memberships[who].i_project);
        }
    }
}
