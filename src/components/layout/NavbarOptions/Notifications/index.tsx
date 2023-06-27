import { Row, Col, Button, Card, Spinner } from 'react-bootstrap'
import Icons from '../../../Icons'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { useContext, useState } from 'react'
import authContext from '../../../../context/auth-context'
import {
    GET_CHANGEMAKER_NOTIFICATION,
    MARK_NOTIFICATION_AS_READ,
    DELETE_NOTIFICATION,
    GET_CHANGEMAKER_NOTIFICATION_All_RECORS
} from './queries'
import { flattenObj } from '../../../../components/utils/responseFlatten'
import moment from 'moment'
import './style.css'
import NoDataFound from '../../../NoDataFound'
import Loader from '../../../Loader/Loader'

const images = {
    '/offerings': 'assets/notifications/offerings.svg',
    '/clients': 'assets/notifications/users.svg'
}

interface Notification {
    id: string
    DateTime: Date
    Title: string
    Body: string
    OnClickRoute: string
    ContactID: string | number
    type: string
    IsRead: boolean
}

function Notifications(): JSX.Element {
    const auth = useContext(authContext)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [page, setPage] = useState<number>(1)
    const [totalRecords, setTotalRecords] = useState<number>(0)
    const [allNotifications, setAllNotifications] = useState<Notification[]>([])

    const { loading: loading_notifications, refetch: refetch_changemaker_notifications } = useQuery(
        GET_CHANGEMAKER_NOTIFICATION,
        {
            variables: { id: auth.userid, start: page * 10 - 10 },
            onCompleted: (data) => {
                const flattenData = flattenObj({ ...data })
                // setNotifications(flattenData.changemakerNotifications);
                getAllNotifications({
                    variables: {
                        id: auth.userid,
                        pageSize: data.changemakerNotifications.meta.pagination.total
                    },
                    onCompleted: (data) => {
                        const flattenData = flattenObj({ ...data })
                        setTotalRecords(data.changemakerNotifications.meta.pagination.total)
                        setAllNotifications(flattenData.changemakerNotifications)
                    }
                })
                setNotifications(flattenData.changemakerNotifications)
            }
        }
    )

    const [getAllNotifications, { data: get_all_notifications }] = useLazyQuery(
        GET_CHANGEMAKER_NOTIFICATION_All_RECORS
    )

    const [changeNotificationStatus] = useMutation(MARK_NOTIFICATION_AS_READ)

    function markAsRead(id: string) {
        changeNotificationStatus({
            variables: { id: id, IsRead: true },
            onCompleted: () => {
                setNotifications((prev) =>
                    prev.map((notification) => {
                        if (notification.id === id) {
                            return { ...notification, IsRead: true }
                        }
                        return notification
                    })
                )
                refetch_changemaker_notifications()
            }
        })
    }

    const [deleteNotification] = useMutation(DELETE_NOTIFICATION)

    function deleteNoti(id: string) {
        deleteNotification({
            variables: { id: id },
            onCompleted: () => {
                setNotifications((prev) => prev.filter((notification) => notification.id !== id))
                refetch_changemaker_notifications()
            }
        })
    }

    function markAsUnread(id: string) {
        changeNotificationStatus({
            variables: { id: id, IsRead: false },
            onCompleted: () => {
                setNotifications((prev) =>
                    prev.map((notification) => {
                        if (notification.id === id) {
                            return { ...notification, IsRead: false }
                        }
                        return notification
                    })
                )
                refetch_changemaker_notifications()
            }
        })
    }

    const readAll = () => {
        for (let i = 0; i < allNotifications.length; i++) {
            changeNotificationStatus({
                variables: { id: allNotifications[i].id, IsRead: true },
                onCompleted: () => {
                    setNotifications((prev) =>
                        prev.map((notification) => {
                            if (notification.id === allNotifications[i].id) {
                                return { ...notification, IsRead: true }
                            }
                            return notification
                        })
                    )
                    refetch_changemaker_notifications()
                }
            })
        }
    }

    const deleteAll = () => {
        for (let i = 0; i < allNotifications.length; i++) {
            deleteNotification({
                variables: { id: allNotifications[i].id },
                onCompleted: () => {
                    refetch_changemaker_notifications()
                }
            })
        }
    }

    const loadPage = (pageNumber: number) => {
        setPage(pageNumber)
        refetch_changemaker_notifications()
    }

    if (loading_notifications && notifications.length === 0) {
        return <Loader msg={'Loading notifications...'} />
    }

    return (
        <div>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                <h2>Notifications</h2>

                <div className="ml-0 ml-sm-auto mt-3 mt-sm-0">
                    {/* delete all button */}
                    <Button
                        className="mx-2 mb-2 mb-sm-0"
                        variant="outline-dark"
                        onClick={() => deleteAll()}
                    >
                        Delete All
                    </Button>

                    {/* read all notifications */}
                    <Button
                        className="mx-2 mb-2 mb-sm-0"
                        variant="outline-dark"
                        onClick={() => readAll()}
                    >
                        Read All
                    </Button>

                    {/* Settings */}
                    <Link to="/notificationSettings">
                        <Button className="mx-2  mb-2 mb-sm-0" variant="outline-dark">
                            Settings
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="mt-5 col-lg-12">
                {notifications && notifications.length ? (
                    notifications.map((currentValue) => {
                        return (
                            <>
                                <div key={`${currentValue.id}`}>
                                    <Row className="my-3">
                                        <Col lg={2}>
                                            <b>
                                                {moment(currentValue.DateTime).format(
                                                    'DD MMM YYYY'
                                                )}
                                            </b>
                                        </Col>
                                    </Row>
                                    <Row className="mt-1">
                                        <Col lg={9} xs={10}>
                                            <Card
                                                style={{
                                                    borderLeft: '5px solid black',
                                                    color: 'black',
                                                    textDecoration: 'none',
                                                    background: `${
                                                        currentValue.IsRead ? 'white' : '#f0f2f2'
                                                    }`
                                                }}
                                                className="p-3 shadow p-3 mb-5 bg-body rounded"
                                            >
                                                <Row>
                                                    <Col lg={1} xs={4} className="pt-3">
                                                        <img
                                                            src={
                                                                images[
                                                                    `${currentValue.OnClickRoute}`
                                                                ]
                                                            }
                                                            alt="users"
                                                            style={{
                                                                width: '50px',
                                                                height: '50px'
                                                            }}
                                                        />
                                                    </Col>

                                                    <Col lg={11} xs={8}>
                                                        <Link
                                                            to={`${currentValue.OnClickRoute}`}
                                                            className="a"
                                                        >
                                                            <p className="ml-2 text-dark">
                                                                {currentValue.Body}
                                                            </p>
                                                        </Link>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col className="d-flex justify-content-end">
                                                        {currentValue.IsRead ? (
                                                            <div
                                                                title="mark as unread"
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    display: 'flex'
                                                                }}
                                                                onClick={() => {
                                                                    markAsUnread(currentValue.id)
                                                                }}
                                                            >
                                                                <Icons
                                                                    name="readeye"
                                                                    width={24}
                                                                    height={24}
                                                                />
                                                                <small className="ml-2 , mt-1">
                                                                    {moment(
                                                                        currentValue.DateTime
                                                                    ).format('HH:mm A')}
                                                                </small>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                title="mark as read"
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    display: 'flex'
                                                                }}
                                                                onClick={() => {
                                                                    markAsRead(currentValue.id)
                                                                }}
                                                            >
                                                                <Icons
                                                                    name="unreadeye"
                                                                    width={24}
                                                                    height={24}
                                                                />
                                                                <small className="ml-2 , mt-1">
                                                                    {moment(
                                                                        currentValue.DateTime
                                                                    ).format('HH:mm A')}
                                                                </small>
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                        <Col lg={1} xs={1} className="py-5">
                                            <div
                                                title="delete notification"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => deleteNoti(currentValue.id)}
                                            >
                                                <Icons name="close" width={24} height={24} />
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </>
                        )
                    })
                ) : (
                    <NoDataFound msg={'Opps ! Notifications not found'} />
                )}

                {/* Pagination */}
                {notifications && notifications.length ? (
                    <Row className="justify-content-end">
                        <Button
                            variant="outline-dark"
                            className="m-2"
                            onClick={() => loadPage(page - 1)}
                            disabled={page === 1 ? true : false}
                        >
                            Previous
                        </Button>

                        <Button
                            variant="outline-dark"
                            className="m-2"
                            onClick={() => loadPage(page + 1)}
                            disabled={
                                totalRecords > page * 10 - 10 + notifications.length ? false : true
                            }
                        >
                            Next
                        </Button>
                        <span className="m-2 bold pt-2">{`${page * 10 - 10 + 1} - ${
                            page * 10 - 10 + notifications.length
                        }`}</span>
                    </Row>
                ) : null}
            </div>
        </div>
    )
}

export default Notifications
