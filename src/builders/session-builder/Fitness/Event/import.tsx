import { useState, useEffect, useRef, useContext } from 'react';
import { GET_TAG_BY_ID, GET_TAGS } from '../../graphQL/queries';
import { useQuery, useLazyQuery } from '@apollo/client';
import { Row, Col, Dropdown, Table, Card, Badge, Accordion } from 'react-bootstrap';
import SchedulerPage from 'builders/program-builder/program-template/scheduler';
import moment from 'moment';
import FitnessAction from '../FitnessAction';
import { Link } from 'react-router-dom';
import { flattenObj } from 'components/utils/responseFlatten';
import SideNav from 'builders/program-builder/program-template/SchedulerSideBar';
import Loader from 'components/Loader/Loader';
import DisplayImage from 'components/DisplayImage';
import Calendar from 'react-calendar';

export {useEffect, useRef, useState, useQuery,useContext,useLazyQuery, GET_TAG_BY_ID,GET_TAGS, Row, Calendar, Col, DisplayImage, Dropdown, Table, Card, Badge, Accordion, SchedulerPage, moment,FitnessAction, Link, flattenObj, SideNav,Loader};