import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import TextEditor from 'components/customWidgets/textEditor';
import ExerciseList from 'components/customWidgets/exerciseList';
import URLlist from '../search-builder/urlList';
import Upload from 'components/upload/upload';

const Build = (props: any) => {
    const [exerciseFields, setExerciseFields] = useState<any[]>([]);
    const [textFields, setTextFields] = useState<any[]>([]);
    const [urlFields, setUrlFields] = useState<any[]>([]);
    const [uploadFields, setUploadFields] = useState<any[]>([]);
    const [currentTab, setCurrentTab] = useState<string | null>(null);

    let warmup: any = {};
    let mainmovement: any = {};
    let cooldown: any = {};

    useEffect(() => {
        if (props.value !== null && props.value !== undefined) {
            if (props?.value[0]?.type === 'upload') {
                setUploadFields(props.value);
                setCurrentTab('upload');
            }
            if (props?.value[0]?.type === 'text') {
                setTextFields(props.value);
                setCurrentTab('text');
            }
            if (props?.value[0]?.type === 'exercise') {
                setExerciseFields(props.value);
                setCurrentTab('exercise');
            }
            if (props?.value[0]?.type === 'url') {
                setUrlFields(props.value);
                setCurrentTab('url');
            }
        }
    }, [props]);

    function handleUploadFieldChange(i: any, event: any) {
        const values = [...uploadFields];
        values[i].type = 'upload';
        values[i].value = event;
        setUploadFields(values);
    }

    //These functions hanlde the adding of the input field
    function handleExerciseFieldAdd(id: any) {
        const values = [...exerciseFields];
        const a = values.length === 0;
        if (a) {
            values.push({ value: null, id: id });
        }
        setExerciseFields(values);
    }
    function handleTextFieldAdd() {
        const values = [...textFields];
        const a = values.length === 0;
        if (a) {
            values.push({ value: null });
        }
        setTextFields(values);
    }
    function handleUrlFieldAdd() {
        const values = [...urlFields];
        values.push({ value: null });
        setUrlFields(values);
    }
    function handleUploadFieldAdd() {
        const values = [...uploadFields];
        values.push({ value: null });
        setUploadFields(values);
    }

    //These functions handle the deletion of the input fields
    function handleExerciseFieldRemove(i: any) {
        const values = [...exerciseFields];
        values.splice(i, 1);
        setExerciseFields(values);
    }

    function handleTextFieldRemove(i: any) {
        const values = [...textFields];
        values.splice(i, 1);
        setTextFields(values);
    }

    function handleUrlFieldRemove(i: any) {
        const values = [...urlFields];
        values.splice(i, 1);
        setUrlFields(values);
    }
    function handleUploadFieldRemove(i: any) {
        const values = [...uploadFields];
        values.splice(i, 1);
        setUploadFields(values);
    }

    function renderOptions() {
        return (
            <div>
                <Button
                    size="sm"
                    className="m-1"
                    variant="outline-secondary"
                    type="button"
                    onClick={() => {
                        handleExerciseFieldAdd(props.buildId);
                        setCurrentTab('exercise');
                    }}
                    disabled={currentTab ? currentTab !== 'exercise' : false}
                >
                    Exercise <i style={{ fontSize: 12 }} className="fas fa-plus"></i>
                </Button>
                <Button
                    size="sm"
                    className="m-1"
                    type="button"
                    variant="outline-secondary"
                    onClick={() => {
                        handleTextFieldAdd();
                        setCurrentTab('text');
                    }}
                    disabled={currentTab ? currentTab !== 'text' : false}
                >
                    Text <i style={{ fontSize: 12 }} className="fas fa-plus"></i>
                </Button>
                <Button
                    size="sm"
                    className="m-1"
                    type="button"
                    variant="outline-secondary"
                    onClick={() => {
                        handleUrlFieldAdd();
                        setCurrentTab('url');
                    }}
                    disabled={currentTab ? currentTab !== 'url' : false}
                >
                    URL <i style={{ fontSize: 12 }} className="fas fa-plus"></i>
                </Button>
                <Button
                    size="sm"
                    className="m-1"
                    type="button"
                    variant="outline-secondary"
                    onClick={() => {
                        handleUploadFieldAdd();
                        setCurrentTab('upload');
                    }}
                    disabled={currentTab ? currentTab !== 'upload' : false}
                >
                    Upload <i style={{ fontSize: 12 }} className="fas fa-plus"></i>
                </Button>
            </div>
        );
    }

    function OnChangeExercise(data: any) {
        if (props.buildId === 1) {
            warmup = data;
            props.onChange(warmup);
        } else if (props.buildId === 2) {
            mainmovement = data;
            props.onChange(mainmovement);
        } else if (props.buildId === 3) {
            cooldown = data;
            props.onChange(cooldown);
        }
    }

    function OnChangeText(data: any) {
        if (props.buildId === 1) {
            warmup = data;
            props.onChange(warmup);
        } else if (props.buildId === 2) {
            mainmovement = data;
            props.onChange(mainmovement);
        } else if (props.buildId === 3) {
            cooldown = data;
            props.onChange(cooldown);
        }
    }

    function OnChangeURL(data: any) {
        if (props.buildId === 1) {
            warmup = data;
            props.onChange(warmup);
        } else if (props.buildId === 2) {
            mainmovement = data;
            props.onChange(mainmovement);
        } else if (props.buildId === 3) {
            cooldown = data;
            props.onChange(cooldown);
        }
    }

    function OnChangeUpload(data: any) {
        if (props.buildId === 1) {
            warmup = data;
            props.onChange(warmup);
        } else if (props.buildId === 2) {
            mainmovement = data;
            props.onChange(mainmovement);
        } else if (props.buildId === 3) {
            cooldown = data;
            props.onChange(cooldown);
        }
    }
    return (
        <div>
            {renderOptions()}
            {exerciseFields.map((field, idx) => {
                return (
                    <div key={`${field}-${idx}`} className="mt-2">
                        <span className="ml-2" style={{ fontSize: '18px' }}>
                            Exercise{' '}
                            <i
                                className="far fa-trash-alt float-right"
                                style={{ color: 'red', cursor: 'pointer' }}
                                onClick={() => {
                                    handleExerciseFieldRemove(idx);
                                    setCurrentTab(null);
                                }}
                            ></i>
                        </span>
                        <ExerciseList
                            onChange={OnChangeExercise}
                            value={exerciseFields.length > 0 && exerciseFields}
                        />
                    </div>
                );
            })}

            {textFields.map((field, idx) => {
                return (
                    <div className="mt-4" key={`${field}-${idx}`}>
                        <span>
                            Add Text{' '}
                            <i
                                className="far fa-trash-alt float-right"
                                style={{ color: 'red', cursor: 'pointer' }}
                                onClick={() => {
                                    handleTextFieldRemove(idx);
                                    setCurrentTab(null);
                                }}
                            ></i>
                        </span>
                        <TextEditor
                            onChangebuild={OnChangeText}
                            type="build"
                            val={textFields.length > 0 && textFields[0]?.value}
                        />
                    </div>
                );
            })}

            {urlFields.map((field, idx) => {
                return (
                    <div key={`${field}-${idx}`}>
                        <span>
                            Add URL{' '}
                            <i
                                className="far fa-trash-alt float-right"
                                style={{ color: 'red', cursor: 'pointer' }}
                                onClick={() => {
                                    handleUrlFieldRemove(idx);
                                    setCurrentTab(null);
                                }}
                            ></i>
                        </span>
                        <URLlist onChange={OnChangeURL} id={idx} field={urlFields} />
                    </div>
                );
            })}
            {uploadFields.map((field, idx) => {
                return (
                    <div key={`${field}-${idx}`} className="m-2">
                        <Upload
                            allowImage={false}
                            allowVideo={true}
                            value={uploadFields.length > 0 && uploadFields[0]?.value}
                            onChange={(e) => {
                                if (e !== null && e !== uploadFields[0]?.value) {
                                    handleUploadFieldChange(idx, e);
                                    OnChangeUpload(uploadFields);
                                }
                            }}
                        />
                        <i
                            className="far fa-trash-alt float-right"
                            style={{ cursor: 'pointer', color: 'red' }}
                            onClick={() => {
                                handleUploadFieldRemove(idx);
                                setCurrentTab(null);
                            }}
                        ></i>
                    </div>
                );
            })}
        </div>
    );
};

export default Build;
