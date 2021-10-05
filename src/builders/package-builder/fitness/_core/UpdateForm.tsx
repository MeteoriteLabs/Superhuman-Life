export class UpdateForm {
    createUpdateForm = (id, packagename, tags, disciplines, fitness_package_type, aboutpackage, benefits, level, mode, ptoffline, ptonline, grouponline, groupoffline, recordedclasses, restdays, fitnesspackagepricing, bookingleadday,bookingleadtime, duration, groupstarttime, groupendtime, groupinstantbooking, address, ptclasssize, classsize, groupdays, introvideourl, is_private) => {
        let updateFormData: any = {};
        updateFormData.id = id
        updateFormData.packagename = packagename;
        updateFormData.tags = tags;
        updateFormData.level = level;
        updateFormData.aboutpackage = aboutpackage
        updateFormData.disciplines = JSON.stringify(disciplines);
        updateFormData.fitness_package_type = fitness_package_type;
        updateFormData.benefits = benefits;
        updateFormData.mode = mode;
        updateFormData.address = address?.id;
        updateFormData.ptclasssize = ptclasssize;
        updateFormData.ptonline = ptonline;
        updateFormData.ptoffline = ptoffline;
        updateFormData.grouponline = grouponline;
        updateFormData.groupoffline = groupoffline;
        updateFormData.recordedclasses = recordedclasses;
        updateFormData.restdays = restdays;
        updateFormData.bookingleadday = bookingleadday;
        updateFormData.bookingleadtime = bookingleadtime;
        updateFormData.duration = duration;
        updateFormData.groupstarttime = groupstarttime;
        updateFormData.groupendtime = groupendtime;
        updateFormData.groupinstantbooking = groupinstantbooking;
        updateFormData.fitnesspackagepricing = fitnesspackagepricing
        updateFormData.classsize = classsize;
        updateFormData.groupdays = groupdays;
        updateFormData.introvideourl = introvideourl;
        updateFormData.is_private = is_private;
        return updateFormData
    }

}

export const updateform = new UpdateForm()