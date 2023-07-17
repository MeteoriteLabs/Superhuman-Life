import { useState, useEffect, useRef } from 'react';
import { GET_TAG_BY_ID } from '../../graphQL/queries';
import { useQuery } from '@apollo/client';
import { Row, Col, Dropdown, Card, Badge, Table, Accordion, Button } from 'react-bootstrap';
import SchedulerPage from '../../../program-builder/program-template/scheduler';
import moment from 'moment';
import FitnessAction from '../FitnessAction';
import { Link } from 'react-router-dom';
import { flattenObj } from 'components/utils/responseFlatten';
import Loader from 'components/Loader/Loader';
import DisplayImage from 'components/DisplayImage';
import Calendar from 'react-calendar';




export {useState, useEffect, useRef , GET_TAG_BY_ID, useQuery,Row, Col, Button, Dropdown, Card, Badge, Table, Accordion,SchedulerPage,moment, FitnessAction,Link,flattenObj, Loader, DisplayImage, Calendar};

