import { expect } from "chai";
import { agent as request } from "supertest";
import * as mongoose from 'mongoose';
import App from "../lib/app";
import Environment from "../lib/environment";

const envParameters = new Environment('test');
const {app} = new App(envParameters);

// Go to https://developers.google.com/oauthplayground/
// Select Google OAuth2 API v2
// Select https://www.googleapis.com/auth/userinfo.email, https://www.googleapis.com/auth/userinfo.profile and openid
// Then replace the googleToken value for the returned in this website.
const googleToken = {"access_token": "ya29.a0AfH6SMCi8YpUN2hjhvFcL6Ut2v0asFSaZBqNPD1MzPXapEaa5kOluzZ-riGA9eg7-9XMExF0RUH2rKPonqnghc41D66Tn19cfGyqbz0X83Nn_VrppycChnW6vhQbLSIixpQMY5yywEz0XMt6mnV3_roKYrowmdnWNe0"};

const courseData = {
    name: 'Course A',
    language: 'en',
    semester: '2020Z',
    description: 'Course A description',
    hidden: false,
    closed: true,
  };
const gradeData = {
    grade: 4,
    description: 'Grade 4 description'
};
const groupData = {
    name: 'Group A'
};
const labData = {
    name: 'Lab A',
    description: 'Lab A description'
};
const linkData = {
    url: 'www.a.com',
    description: 'Link A description'
};
const filename = `${process.cwd()  }/test/task.jpeg`;

var adminIdForAdminTest;
var courseIdForCourseTest;
var courseIdForGradeTest;
var courseIdForGroupTest;
var courseIdForLabTest;
var courseIdForLinkTest;
var courseIdForTaskTest;
var courseIdForStudentTest;

var gradeIdForGradeTest;

var groupIdForGroupTest;

var labIdForGradeTest;
var labIdForLabTest;
var labIdForTaskTest;
var labIdForStudentTest;

var linkIdForLinkTest;

var taskIdForTaskTest;
var taskIdForStudentTest;

var adminToken;
var studentToken;

var studentIdForStudentTest;

var submissionForAdminTest;
var submissionIdForStudentTest;

// Test by Routes
// Admin Route
describe('Admin Route', ()=> {
  /* Admin Controller Begin */
  // GET /google/oauth/admin
  it('GET /google/oauth/admin - Should register a new Admin or a login a existent Admin with google oauth', async () => {
    const res = await request(app)
      .get('/google/oauth/admin')
      .send(googleToken)
      .expect(200);
    adminToken = res.body.token;
  });
  // GET /admin/logout
  it('GET /admin/logout - Should do the logout', async () => {
    const res = await request(app)
      .get('/admin/logout')
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(res.body.ok).to.equal(true);
  });
  // GET /admin/profile
  it('GET /admin/profile - Should get the Admin profile', async () => {
    const res = await request(app)
      .get('/admin/profile')
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(res.body.ok).to.equal(true);
  });
  /* Admin Controller End */

  /* Course Controller Begin */
  // POST /admin/course - Should add new Course
  it('POST /admin/course - Should add new Course', async () => {
    const res = await request(app)
      .post('/admin/course')
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(courseData)
      .expect(200);
    expect(res.body.ok).to.equal(true);
    courseIdForCourseTest = res.body.course._id;
  });
  // GET /admin/course - Should get all courses
  it('GET /admin/course - Should get all courses', async () => {
    const res = await request(app)
      .get('/admin/course')
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(res.body.allCourses.length).to.greaterThan(0);
  });
  // GET /admin/course/courseId - Should get specific course
  it('GET /admin/course/courseId - Should get specific course', async () => {
    let courseId = courseIdForCourseTest;
            let res = await request(app)
        .get(`/admin/course/${  courseId}`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.course._id).to.equal(courseId);
  });
  // PUT /admin/course/:courseId - Should update Course
  it('PUT /admin/course/:courseId - Should update Course', async () => {
    let courseId = courseIdForCourseTest;
            let res = await request(app)
        .put(`/admin/course/${  courseId}`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .type('form')
        .send(courseData)
        .expect(200);
    expect(res.body.result.ok).to.equal(1);
  });
  // DELETE /admin/course/:courseId - Should delete Course
  it('DELETE /admin/course/:courseId - Should delete Course', async () => {
    let courseId = courseIdForCourseTest;
            let res = await request(app)
        .delete(`/admin/course/${  courseId}`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json');
    if (res.status == 401) {
      expect(res.status).equal(401);
    }
    if (res.status == 200) {
      expect(res.status).equal(200);
      expect(res.body.result._id).to.equal(courseId);
    }
  });
  /* Course Controller End */


  /* Link Controller Begin */
  // POST /admin/course/:courseId/link - Should add new Link
  it('POST /admin/course/:courseId/link - Should add new Link', async () => {
    const resCourse = await request(app)
      .post('/admin/course')
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(courseData)
      .expect(200);
    courseIdForLinkTest = resCourse.body.course._id;
    let courseId = courseIdForLinkTest;
    const res = await request(app)
      .post(`/admin/course/${  courseId  }/link`)
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(linkData)
      .expect(200);
    linkIdForLinkTest = res.body.link._id;
    expect(res.body.ok).to.equal(true);
  });
  // GET /course/course/:courseId/link - Should get all links
  it('GET /admin/course/:courseId/link - Should get all links', async () => {
    const courseId = courseIdForLinkTest;
    const res = await request(app)
      .get(`/admin/course/${  courseId  }/link`)
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(res.body.links.length).to.greaterThan(0);
  });
  // GET /admin/course/:courseId/link/:linkId - Should get specific link
  it('GET /admin/course/:courseId/link/:linkId - Should get specific link', async () => {
    let courseId = courseIdForLinkTest;
            let linkId = linkIdForLinkTest;
            let res = await request(app)
        .get(`/admin/course/${  courseId  }/link/${  linkId}`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.link._id).to.equal(linkId);
  });
  // PUT /admin/course/:courseId/link/:linkId - Should update Link
  it('PUT /admin/course/:courseId/link/:linkId - Should update Link', async () => {
    const courseId = courseIdForLinkTest;
            let linkId = linkIdForLinkTest;
            let res = await request(app)
        .put(`/admin/course/${  courseId  }/link/${  linkId}`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .type('form')
        .send(linkData)
        .expect(200);
    expect(res.body.result.ok).to.equal(1);
  });
  // DELETE /admin/course/:courseId/link/:linkId - Should delete Link
  it('DELETE /admin/course/:courseId/link/:linkId - Should delete Link', async () => {
    const courseId = courseIdForLinkTest;
            let linkId = linkIdForLinkTest;
            let res = await request(app)
        .delete(`/admin/course/${  courseId  }/link/${  linkId}`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.result._id).to.equal(linkId);
  });
  /* Link Controller End */

  /* Group Controller Begin */
  // POST /admin/course/:courseId/group - Should add new Group
  it('POST /admin/course/:courseId/group - Should add new Group', async () => {
    const resCourse = await request(app)
      .post('/admin/course')
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(courseData)
      .expect(200);
    courseIdForGroupTest = resCourse.body.course._id;
    let courseId = courseIdForGroupTest;
            let res = await request(app)
        .post(`/admin/course/${  courseId  }/group`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .type('form')
        .send(groupData)
        .expect(200);
    groupIdForGroupTest = res.body.group._id;
    expect(res.body.ok).to.equal(true);
  });
  // GET /course/course/:courseId/group - Should get all groups
  it('GET /admin/course/:courseId/group - Should get all groups', async () => {
    let courseId = courseIdForGroupTest;
    let res = await request(app)
      .get(`/admin/course/${  courseId  }/group`)
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(res.body.groups.length).to.greaterThan(0);
  });
  // GET /course/courseId/:courseId/group/:groupId - Should get specific group
  it('GET /admin/course/:courseId/group/:groupId - Should get specific group', async () => {
    const courseId = courseIdForGroupTest;
            let groupId = groupIdForGroupTest;
    const res = await request(app)
      .get(`/admin/course/${  courseId  }/group/${  groupId}`)
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(res.body.group._id).to.equal(groupId);
  });
  // PUT /admin/course/:courseId/group/:groupId - Should update Group
  it('PUT /admin/course/:courseId/group/:groupId - Should update Group', async () => {
    let courseId = courseIdForGroupTest;
            let groupId = groupIdForGroupTest;
    const res = await request(app)
      .put(`/admin/course/${  courseId  }/group/${  groupId}`)
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(groupData)
      .expect(200);
    expect(res.body.result.ok).to.equal(1);
  });
  // DELETE /admin/course/:courseId/group/:groupId - Should delete Group
  it('DELETE /admin/course/:courseId/group/:groupId - Should delete Group', async () => {
    let courseId = courseIdForGroupTest;
            let groupId = groupIdForGroupTest;
    const res = await request(app)
      .delete(`/admin/course/${  courseId  }/group/${  groupId}`)
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(res.body.result._id).to.equal(groupId);
  });
  /* Group Controller End */

  /* Lab Controller Start */
  // POST /admin/course/:courseId/lab - Should add new Lab
  it('POST /admin/course/:courseId/lab - Should add new Lab', async () => {
    const resCourse = await request(app)
      .post('/admin/course')
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(courseData)
      .expect(200);
    courseIdForLabTest = resCourse.body.course._id;
    let courseId = courseIdForLabTest;
            let res = await request(app)
        .post(`/admin/course/${  courseId  }/lab`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .type('form')
        .send(labData)
        .expect(200);
    labIdForLabTest = res.body.lab._id;
    expect(res.body.ok).to.equal(true);
  });
  // GET /course/course/:courseId/lab - Should get all labs
  it('GET /admin/course/:courseId/lab - Should get all labs', async () => {
    const courseId = courseIdForLabTest;
            let res = await request(app)
        .get(`/admin/course/${  courseId  }/lab`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.labs.length).to.greaterThan(0);
  });
  // GET /admin/course/:courseId/lab/:labId - Should get specific lab
  it('GET /admin/course/:courseId/lab/:labId - Should get specific lab', async () => {
    let courseId = courseIdForLabTest;
            let labId = labIdForLabTest;
            let res = await request(app)
        .get(`/admin/course/${  courseId  }/lab/${  labId}`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.lab._id).to.equal(labId);
  });
  // PUT /admin/course/:courseId/lab/:labId - Should update Lab
  it('PUT /admin/course/:courseId/lab/:labId - Should update Lab', async () => {
    let courseId = courseIdForLabTest;
        let labId = labIdForLabTest;
            let res = await request(app)
        .put(`/admin/course/${  courseId  }/lab/${  labId}`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .type('form')
        .send(labData)
        .expect(200);
    expect(res.body.result.ok).to.equal(1);
  });
  // DELETE /admin/course/:courseId/lab/:labId - Should delete Lab
  it('DELETE /admin/course/:courseId/lab/:labId - Should delete Lab', async () => {
    let courseId = courseIdForLabTest;
            let labId = labIdForLabTest;
            let res = await request(app)
        .delete(`/admin/course/${  courseId  }/lab/${  labId}`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.result._id).to.equal(labId);
  });
  /* Lab Controller End */

  /* Grade Controller Begin */
  // POST /admin/course/:courseId/lab/:labId/grade - Should add new Grade
  it('POST /admin/course/:courseId/lab/:labId/grade - Should add new Grade', async () => {
    const resCourse = await request(app)
      .post('/admin/course')
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(courseData)
      .expect(200);
    courseIdForGradeTest = resCourse.body.course._id;
    let courseId = courseIdForGradeTest;
            let resLab = await request(app)
        .post(`/admin/course/${  courseId  }/lab`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .type('form')
        .send(labData)
        .expect(200);
    labIdForGradeTest = resLab.body.lab._id;
    let labId = labIdForGradeTest;
            let res = await request(app)
        .post(`/admin/course/${  courseId  }/lab/${  labId  }/grade`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .type('form')
        .send(gradeData)
        .expect(200);
    gradeIdForGradeTest = res.body.grade._id;
    expect(res.body.ok).to.equal(true);
  });
  // GET /admin/course/:courseId/lab/labId/grade - Should get all grades
  it('GET /admin/course/:courseId/lab/labId/grade - Should get all grades', async () => {
    let courseId = courseIdForGradeTest;
            let labId = labIdForGradeTest;
            let res = await request(app)
        .get(`/admin/course/${  courseId  }/lab/${  labId  }/grade`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.grades.length).to.greaterThan(0);
  });
  // GET /course/courseId/lab/:labId/grade/:gradeId - Should get specific grade
  it('GET /course/:courseId/lab/:labId/grade/:gradeId - Should get specific grade', async () => {
    const courseId = courseIdForGradeTest;
            let labId = labIdForGradeTest;
            let gradeId = gradeIdForGradeTest;
            let res = await request(app)
        .get(`/admin/course/${  courseId  }/lab/${  labId  }/grade/${  gradeId}`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.grade._id).to.equal(gradeId);
  });
  // PUT /admin/course/:courseId/lab/:labId/grade/:gradeId - Should update Grade
  it('PUT /admin/course/:courseId/lab/:labId/grade/:gradeId - Should update Grade', async () => {
    const courseId = courseIdForGradeTest;
            let labId = labIdForGradeTest;
            let gradeId = gradeIdForGradeTest;
            let res = await request(app)
        .put(`/admin/course/${  courseId  }/lab/${  labId  }/grade/${  gradeId}`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .type('form')
        .send({
          "grade": '3',
          "description": 'Grade 3'
        })
        .expect(200);
    expect(res.body.result.ok).to.equal(1);
  });
  // DELETE /admin/course/:courseId/lab/:labId/grade/:gradeId - Should delete Grade
  it('DELETE /admin/course/:courseId/lab/:labId/grade/:gradeId - Should delete Grade', async () => {
    const courseId = courseIdForGradeTest;
            let labId = labIdForGradeTest;
            let gradeId = gradeIdForGradeTest;
    const res = await request(app)
      .delete(`/admin/course/${  courseId  }/lab/${  labId  }/grade/${  gradeId}`)
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(res.body.result._id).to.equal(gradeId);
  });
  /* Grade Controller End */

  /* Task Controller Begin */
  // POST /admin/course/:courseId/lab/:labId/task - Should add new Task
  it('POST /admin/course/:courseId/lab/:labId/task - Should add new Task', async () => {
    let resCourse = await request(app)
      .post('/admin/course')
      .set('Authorization', adminToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(courseData)
      .expect(200);
    courseIdForTaskTest = resCourse.body.course._id;
    let courseId = courseIdForTaskTest;
            let resLab = await request(app)
        .post(`/admin/course/${  courseId  }/lab`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .type('form')
        .send(labData)
        .expect(200);
    labIdForTaskTest = resLab.body.lab._id;
    labIdForStudentTest = resLab.body.lab._id;
    let labId = labIdForTaskTest;
            let res = await request(app)
        .post(`/admin/course/${  courseId  }/lab/${  labId  }/task/`)
        .set('Authorization', adminToken)
        .field('Content-Type', 'multipart/form-data')
        .field('name', 'Task name')
        .field('description', 'Task description')
        .field('dateFrom', '2020-10-25')
        .field('dateTo', '2020-10-30')
        .field('gracePeriod', '5')
        .attach('resource', filename)
        .expect(200);
    taskIdForTaskTest = res.body.task._id;
    expect(res.body.ok).to.equal(true);
  });
  // GET /course/course/:courseId/lab/:labId/task - Should get all tasks
  it('GET /admin/course/:courseId/lab/:labId/task - Should get all tasks', async () => {
    let courseId = courseIdForTaskTest;
            let labId = labIdForTaskTest;
            let res = await request(app)
        .get(`/admin/course/${  courseId  }/lab/${  labId  }/task/`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.tasks.length).to.greaterThan(0);
  });
  // GET /admin/course/:courseId/lab/:labId/task/:taskId - Should get specific task
  it('GET /admin/course/:courseId/lab/:labId/task/:taskId - Should get specific task', async () => {
    let courseId = courseIdForTaskTest;
            let labId = labIdForTaskTest;
            let taskId = taskIdForTaskTest;
            let res = await request(app)
        .get(`/admin/course/${  courseId  }/lab/${  labId  }/task/${  taskId}`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.task._id).to.equal(taskId);
  });
  // PUT /admin/course/:courseId/lab/:labId/task/:taskId - Should update task
  it('PUT /admin/course/:courseId/lab/:labId/task/:taskId - Should update task', async () => {
    const courseId = courseIdForTaskTest;
            let labId = labIdForTaskTest;
            let taskId = taskIdForTaskTest;
            let res = await request(app)
        .put(`/admin/course/${  courseId  }/lab/${  labId  }/task/${  taskId}`)
        .set('Authorization', adminToken)
        .field('Content-Type', 'multipart/form-data')
        .field('name', 'Task name')
        .field('description', 'Task description')
        .field('dateFrom', '2020-10-25')
        .field('dateTo', '2020-10-30')
        .field('gracePeriod', '5')
        .attach('resource', filename)
        .expect(200);
    expect(res.body.result.ok).to.equal(1);
  });
  // DELETE /admin/course/:courseId/lab/:labId/task/:taskId - Should delete task
  it('DELETE /admin/course/:courseId/lab/:labId/task/:taskId - Should delete task', async () => {
    let courseId = courseIdForTaskTest;
            let labId = labIdForTaskTest;
            let taskId = taskIdForTaskTest;
            let res = await request(app)
        .delete(`/admin/course/${  courseId  }/lab/${  labId  }/task/${  taskId}`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.result._id).to.equal(taskId);
  });
  /* Task Controller End */

  /* Submission Controller Begin */
  // POST /admin/course/courseId/lab/:labId/task/:taskId - Do a submission
  it('POST /admin/course/:courseId/lab/:labId/task/:taskId - Do a submission', async () => {
    const courseId = courseIdForCourseTest;
            let labId = labIdForStudentTest;
            let taskId = taskIdForTaskTest;
    let res = await request(app)
      .post(`/admin/course/${  courseId  }/lab/${  labId  }/task/${  taskId}`)
      .set('Authorization', adminToken)
      .field('Content-Type', 'multipart/form-data')
      .field('date', '2020-10-30')
      .attach('resource', filename)
      .expect(200);
    expect(res.body.ok).to.equal(true);
    submissionForAdminTest = res.body.submission._id;
  });
  // GET /course/course/:courseId/lab/:labId/task/:taskId/sub - Should get all submissions
  it('GET /admin/course/:courseId/lab/:labId/task/:taskId/sub - Should get all submissions', async () => {
    const courseId = courseIdForTaskTest;
            let labId = labIdForTaskTest;
            let taskId = taskIdForTaskTest;
            let res = await request(app)
        .get(`/admin/course/${  courseId  }/lab/${  labId  }/task/${  taskId  }/sub`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.submissions.length).to.greaterThan(0);
  });
  // GET /admin/course/:courseId/lab/:labId/task/:taskId/sub/submissionId - Should get specific submissions
  it('GET /admin/course/:courseId/lab/:labId/task/:taskId/sub/submissionId - Should get specific submissions', async () => {
    const courseId = courseIdForTaskTest;
            let labId = labIdForTaskTest;
            let taskId = taskIdForTaskTest;
            let submissionId = submissionForAdminTest;
            let res = await request(app)
        .get(`/admin/course/${  courseId  }/lab/${  labId  }/task/${  taskId  }/sub/${  submissionId}`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.submission._id).to.equal(submissionId);
  });
  // PUT /admin/course/:courseId/lab/:labId/task/:taskId/sub/submissionId - Should update a submission
  it('PUT /admin/course/:courseId/lab/:labId/task/:taskId/sub/submissionId - Should update a submission', async () => {
    const courseId = courseIdForTaskTest;
            let labId = labIdForTaskTest;
            let taskId = taskIdForTaskTest;
            let submissionId = submissionForAdminTest;
            let res = await request(app)
        .put(`/admin/course/${  courseId  }/lab/${  labId  }/task/${  taskId  }/sub/${  submissionId}`)
        .set('Authorization', adminToken)
        .field('Content-Type', 'multipart/form-data')
        .field('date', '2020-10-30')
        .attach('resource', filename)
        .expect(200);
    expect(res.body.result.ok).to.equal(1);
  });
  // DELETE /admin/course/:courseId/lab/:labId/task/:taskId/sub/:submissionId - Should delete submission
  it('DELETE /admin/course/:courseId/lab/:labId/task/:taskId/sub/:submissionId - Should delete submission', async () => {
    let courseId = courseIdForTaskTest;
            let labId = labIdForTaskTest;
            let taskId = taskIdForTaskTest;
            let submissionId = submissionForAdminTest;
            let res = await request(app)
        .delete(`/admin/course/${  courseId  }/lab/${  labId  }/task/${  taskId  }/sub/${  submissionId}`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.result._id).to.equal(submissionId);
  });
  /* Submission Controller End */
});

// Student Controller
describe('Student Controller Endpoints', async () => {
  // GET /google/oauth/student
  it('GET /google/oauth/student - Should register a new Student or a login a existent Student with google oauth', async () => {
    const res = await request(app)
      .get('/google/oauth/student')
      .send(googleToken)
      .expect(200);
    studentToken = res.body.token;
  });
  // GET /student/logout
  it('GET /student/logout - Should do the logout', async () => {
    const res = await request(app)
      .get('/student/logout')
      .set('Authorization', studentToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(res.body.ok).to.equal(true);
  });
  // GET /student/profile
  it('GET /student/profile - Should get the Student profile', async () => {
    const res = await request(app)
      .get('/student/profile')
      .set('Authorization', studentToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(res.body.ok).to.equal(true);
  });
  // POST /student/course/:courseId - Should apply to this course
  it('POST /student/course/:courseId - Should apply to this course', async () => {
    let courseId = courseIdForLabTest;
            let res = await request(app)
        .post(`/student/course/${  courseId}`)
        .set('Authorization', studentToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.ok).to.equal(true);
  });
  // GET /student/mycourse - Should get all my courses
  it('GET /student/mycourse - Should get all my courses', async () => {
    const res = await request(app)
      .get('/student/mycourse')
      .set('Authorization', studentToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(res.body.myCourses.length).to.greaterThan(0);
    courseIdForStudentTest = res.body.myCourses[0]._id;
  });
  // GET /student/mycourse/courseId - Should get my course
  it('GET /student/mycourse/:courseId - Should get my course', async () => {
    let courseId = courseIdForStudentTest;
            let res = await request(app)
        .get(`/student/mycourse/${  courseId}`)
        .set('Authorization', studentToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.myCourse._id).to.equal(courseId);
  });
  // GET /student/mycourse/courseId/mylab - Should get my labs
  it('GET /student/mycourse/:courseId/mylab - Should get my labs', async () => {
    let courseId = courseIdForStudentTest;
            let resLab = await request(app)
        .post(`/admin/course/${  courseId  }/lab`)
        .set('Authorization', adminToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .type('form')
        .send(labData);
    labIdForStudentTest = resLab.body.lab._id;
    let res = await request(app)
      .get(`/student/mycourse/${  courseId  }/mylab`)
      .set('Authorization', studentToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(res.body.myLabs.length).to.greaterThan(0);
  });
  // GET /student/mycourse/courseId/mylab/:labId - Should get my lab
  it('GET /student/mycourse/:courseId/mylab/:labId - Should get my lab', async () => {
    const courseId = courseIdForStudentTest;
            let labId = labIdForStudentTest;
            let res = await request(app)
        .get(`/student/mycourse/${  courseId  }/mylab/${  labId}`)
        .set('Authorization', studentToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.myLab._id).to.equal(labId);
  });
  // GET /student/mycourse/courseId/mylab/:labId/mytask - Should get my tasks
  it('GET /student/mycourse/:courseId/mylab/:labId/mytask - Should get my tasks', async () => {
    const courseId = courseIdForStudentTest;
            let labId = labIdForStudentTest;
            let resTask = await request(app)
        .post(`/admin/course/${  courseId  }/lab/${  labId  }/task/`)
        .set('Authorization', adminToken)
        .field('Content-Type', 'multipart/form-data')
        .field('name', 'Task name')
        .field('description', 'Task description')
        .field('dateFrom', '2020-10-25')
        .field('dateTo', '2020-10-30')
        .field('gracePeriod', '5')
        .attach('resource', filename);
    taskIdForStudentTest = resTask.body.task._id;
    let res = await request(app)
      .get(`/student/mycourse/${  courseId  }/mylab/${  labId  }/mytask`)
      .set('Authorization', studentToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(res.body.myTasks.length).to.greaterThan(0);
  });
  // GET /student/mycourse/courseId/mylab/:labId/mytask/:taskId - Should get my task
  it('GET /student/mycourse/:courseId/mylab/:labId/mytask/:taskId - Should get my task', async () => {
    let courseId = courseIdForStudentTest;
            let labId = labIdForStudentTest;
            let taskId = taskIdForStudentTest;
            let res = await request(app)
        .get(`/student/mycourse/${  courseId  }/mylab/${  labId  }/mytask/${  taskId}`)
        .set('Authorization', studentToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.myTask._id).to.equal(taskId);
  });
  // POST /student/mycourse/courseId/mylab/:labId/mytask/:taskId - Should submit a task
  it('POST /student/mycourse/:courseId/mylab/:labId/mytask/:taskId - Should submit a task', async () => {
    const courseId = courseIdForStudentTest;
            let labId = labIdForStudentTest;
            let taskId = taskIdForStudentTest;
            let res = await request(app)
        .post(`/student/mycourse/${  courseId  }/mylab/${  labId  }/mytask/${  taskId}`
        )
        .set('Authorization', studentToken)
        .field('Content-Type', 'multipart/form-data')
        .field('date', '2020-10-30')
        .attach('resource', filename)
        .expect(200);
    expect(res.body.ok).to.equal(true);
    submissionIdForStudentTest = res.body.submission._id;
  });
  // GET /student/mycourse/courseId/mylab/:labId/mytask/:taskId/mysub - Should get my submissions
  it('GET /student/mycourse/:courseId/mylab/:labId/mytask/:taskId/mysub - Should get my submissions', async () => {
    const courseId = courseIdForStudentTest;
            let labId = labIdForStudentTest;
            let taskId = taskIdForStudentTest;
    const res = await request(app)
      .get(`/student/mycourse/${  courseId  }/mylab/${  labId  }/mytask/${  taskId  }/mysub`)
      .set('Authorization', studentToken)
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(res.body.mySubmissions.length).to.greaterThan(0);
  });
  // GET /student/mycourse/courseId/mylab/:labId/mytask/:taskId/mysub/:submissionId - Should get my submission
  it('GET /student/mycourse/:courseId/mylab/:labId/mytask/:taskId/mysub/:submissionId - Should get my submission', async () => {
    const courseId = courseIdForStudentTest;
            let labId = labIdForStudentTest;
            let taskId = taskIdForStudentTest;
            let submissionId = submissionIdForStudentTest;
            let res = await request(app)
        .get(`/student/mycourse/${  courseId  }/mylab/${  labId  }/mytask/${  taskId  }/mysub/${  submissionId}`
        )
        .set('Authorization', studentToken)
        .set('Connection', 'keep alive')
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(res.body.mySubmission._id).to.equal(submissionId);
  });
});

// Public Route
describe('Public Endpoints', async () => {
  // GET /course - Should get all not hidden courses
  it('GET /course - Should get all not hidden courses', async () => {
    const res = await request(app).get('/course');
    expect(res.status).to.equal(200);
    expect(res.body.allNotHiddenCourses.length).to.greaterThan(0);
    courseIdForCourseTest = res.body.allNotHiddenCourses[0]._id;
  });
  // GET /course/courseId - Should get specific not hidden courses
  it('GET /course/courseId - Should get  specific not hidden courses', async () => {
    const courseId = courseIdForCourseTest;
    let res = await request(app).get(`/course/${courseId}`);
    expect(res.status).to.equal(200);
    expect(res.body.course._id).to.equal(courseId);
  });
});
