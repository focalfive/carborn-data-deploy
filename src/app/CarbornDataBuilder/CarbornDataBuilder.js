import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import LinearProgress from 'material-ui/LinearProgress';
import $ from 'jquery';

const styles = {
    carbornDataBuilder: {
        textAlign: 'center',
        paddingTop: 20,
    },
    textFieldVersion: {
        width: 100,
        margin: '0 5px',
    }
};

class CarbornDataBuilder extends React.Component {

    state = {
        carbornVersionNumber: null,
        carbornDisplayVersionMajor: 0,
        carbornDisplayVersionMinor: 0,
        carbornDisplayVersionBuild: 0,
        carbornDisplayVersionMajorNext: 0,
        carbornDisplayVersionMinorNext: 0,
        carbornDisplayVersionBuildNext: 0,
        deployDialogOpen: false,
        deployProgress: false,
    }

    componentDidMount() {
        $.ajax({
            url: 'http://slowslipper.woobi.co.kr/carborn/api/',
        }).done((response) => {
            this.setState({
                carbornVersionNumber: response.versionNumber,
                carbornDisplayVersionMajor: response.displayVersion.major,
                carbornDisplayVersionMinor: response.displayVersion.minor,
                carbornDisplayVersionBuild: response.displayVersion.build,
                carbornDisplayVersionMajorNext: response.displayVersion.major,
                carbornDisplayVersionMinorNext: response.displayVersion.minor,
                carbornDisplayVersionBuildNext: response.displayVersion.build,
            });
        });
    }

    deployDialogOpenButtonDidSelect = () => {
        this.setState({
            deployDialogOpen: true,
        }, () => {
            this.refs.textFieldMajorVersion.select();
        });
    }

    closeDeployDialog = () => {
        this.setState({
            deployDialogOpen: false,
        });
    }

    textFieldMajorVersionDidChange = (event) => {
        let value = event.target.value;
        if(isNaN(value)) {
            return;
        }
        value = Int(value);
        if(value < this.state.carbornDisplayVersionMajor) {
            return;
        }

        this.setState({
            carbornDisplayVersionMajorNext, value,
        });
    }

    textFieldMajorVersionDidKeyDown = (event) => {
        if(event.keyCode == 38) {
            this.setState({
                carbornDisplayVersionMajorNext: this.state.carbornDisplayVersionMajorNext + 1,
            });
        } else if(event.keyCode == 40 && this.state.carbornDisplayVersionMajorNext > this.state.carbornDisplayVersionMajor) {
            this.setState({
                carbornDisplayVersionMajorNext: this.state.carbornDisplayVersionMajorNext - 1,
            });
        }
    }

    textFieldMinorVersionDidChange = (event) => {
        let value = event.target.value;
        if(isNaN(value)) {
            return;
        }
        value = Int(value);
        if(value < this.state.carbornDisplayVersionMinor) {
            return;
        }

        this.setState({
            carbornDisplayVersionMinorNext, value,
        });
    }

    textFieldMinorVersionDidKeyDown = (event) => {
        if(event.keyCode == 38) {
            this.setState({
                carbornDisplayVersionMinorNext: this.state.carbornDisplayVersionMinorNext + 1,
            });
        } else if(event.keyCode == 40 && this.state.carbornDisplayVersionMinorNext > this.state.carbornDisplayVersionMinor) {
            this.setState({
                carbornDisplayVersionMinorNext: this.state.carbornDisplayVersionMinorNext - 1,
            });
        }
    }

    textFieldBuildVersionDidChange = (event) => {
        let value = event.target.value;
        if(isNaN(value)) {
            return;
        }
        value = Int(value);
        if(value < this.state.carbornDisplayVersionBuild) {
            return;
        }

        this.setState({
            carbornDisplayVersionBuildNext, value,
        });
    }

    textFieldBuildVersionDidKeyDown = (event) => {
        if(event.keyCode == 38) {
            this.setState({
                carbornDisplayVersionBuildNext: this.state.carbornDisplayVersionBuildNext + 1,
            });
        } else if(event.keyCode == 40 && this.state.carbornDisplayVersionBuildNext > this.state.carbornDisplayVersionBuild) {
            this.setState({
                carbornDisplayVersionBuildNext: this.state.carbornDisplayVersionBuildNext - 1,
            });
        }
    }

    submit = () => {
        this.setState({
            deployProgress: true,
        }, () => {
            const {
                carbornVersionNumber,
                carbornDisplayVersionMajorNext,
                carbornDisplayVersionMinorNext,
                carbornDisplayVersionBuildNext,
            } = this.state;
            let versionNumber = isNaN(carbornVersionNumber) ? 0 : carbornVersionNumber + 1;
            let major = isNaN(carbornDisplayVersionMajorNext) ? 0 : carbornDisplayVersionMajorNext;
            let minor = isNaN(carbornDisplayVersionMinorNext) ? 0 : carbornDisplayVersionMinorNext;
            let build = isNaN(carbornDisplayVersionBuildNext) ? 0 : carbornDisplayVersionBuildNext;
            let displayVersion = major + '.' + minor + '.' + build;

            // TODO: Make secure options like sessionToken
            $.ajax({
                url: 'http://slowslipper.woobi.co.kr/carborn/api/deploy/',
                data: {
                    versionNumber: versionNumber,
                    displayVersion: displayVersion,
                }
            }).done((response) => {
                this.setState({
                    carbornVersionNumber: response.versionNumber,
                    carbornDisplayVersion: response.displayVersion,
                    carbornDisplayVersionNext: response.displayVersion,
                    deployDialogOpen: false,
                    deployProgress: false,
                });
            });
        });
    }

    render() {
        const {
            carbornVersionNumber,
            carbornDisplayVersionMajor,
            carbornDisplayVersionMinor,
            carbornDisplayVersionBuild,
            carbornDisplayVersionMajorNext,
            carbornDisplayVersionMinorNext,
            carbornDisplayVersionBuildNext,
            deployDialogOpen,
            deployProgress,
        } = this.state;

        const buttonLabelDeploy = "Deploy - Carborn data" + (!!carbornVersionNumber ? ' (v' + (carbornVersionNumber + 1) + ')' :'');
        let dialogActions = [];
        if(carbornVersionNumber != null) {
            dialogActions.push(
                <FlatButton
                    label="Cancel"
                    primary={true}
                    onTouchTap={this.closeDeployDialog}
                />,
            );
            let buttonOkDisable = true;
            if(carbornDisplayVersionMajorNext >= carbornDisplayVersionMajor &&
                carbornDisplayVersionMinorNext >= carbornDisplayVersionMinor &&
                carbornDisplayVersionBuildNext >= carbornDisplayVersionBuild) {
                buttonOkDisable = false;
            }
            dialogActions.push(
                <FlatButton
                    label="Ok"
                    primary={true}
                    onTouchTap={this.submit}
                    disabled={buttonOkDisable}
                />,
            );
        }

        return (
            <div style={styles.carbornDataBuilder}>
                    <RaisedButton label={buttonLabelDeploy} disabled={carbornVersionNumber == null} onTouchTap={this.deployDialogOpenButtonDidSelect} />
                    <Dialog
                        title="Deploy carborn data"
                        modal={false}
                        actions={dialogActions}
                        open={deployDialogOpen}
                        onRequestClose={this.closeDeployDialog}
                    >
                        {deployProgress ? (
                            <div>
                                <LinearProgress mode="indeterminate" />
                                <div style={{paddingTop: 20, textAlign: 'center'}}>Deploying...</div>
                            </div>
                        ) : (
                            <div>
                                <TextField
                                    ref="textFieldMajorVersion"
                                    hintText={carbornDisplayVersionMajor}
                                    floatingLabelText="Major version"
                                    value={carbornDisplayVersionMajorNext}
                                    style={styles.textFieldVersion}
                                    onChange={this.textFieldMajorVersionDidChange}
                                    onKeyDown={this.textFieldMajorVersionDidKeyDown}
                                    disabled={deployProgress}
                                />
                                <TextField
                                    hintText={carbornDisplayVersionMinor}
                                    floatingLabelText="Minor version"
                                    value={carbornDisplayVersionMinorNext}
                                    style={styles.textFieldVersion}
                                    onChange={this.textFieldMinorVersionDidChange}
                                    onKeyDown={this.textFieldMinorVersionDidKeyDown}
                                    disabled={deployProgress}
                                />
                                <TextField
                                    hintText={carbornDisplayVersionBuild}
                                    floatingLabelText="Build version"
                                    value={carbornDisplayVersionBuildNext}
                                    style={styles.textFieldVersion}
                                    onChange={this.textFieldBuildVersionDidChange}
                                    onKeyDown={this.textFieldBuildVersionDidKeyDown}
                                    disabled={deployProgress}
                                />
                            </div>
                        )}
                    </Dialog>
                </div>
        );
    }
}

export default CarbornDataBuilder;
